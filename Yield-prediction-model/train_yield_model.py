import argparse
import json
import os
import sys
import warnings
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor

warnings.filterwarnings("ignore")


def infer_target_column(df: pd.DataFrame, explicit: Optional[str]) -> str:
	candidates = []
	if explicit and explicit in df.columns:
		return explicit
	lower_cols = {c.lower(): c for c in df.columns}
	for k in ["yield", "yield_kg", "crop_yield", "target", "label"]:
		if k in lower_cols:
			return lower_cols[k]
	for c in df.columns:
		if c.lower().endswith("yield") or "yield" in c.lower():
			candidates.append(c)
	if candidates:
		return candidates[0]
	raise ValueError("Unable to infer target column. Pass --target <column>.")


def split_features(df: pd.DataFrame, target: str) -> Tuple[pd.DataFrame, pd.Series, List[str], List[str]]:
	X = df.drop(columns=[target])
	y = df[target]
	
	# Remove date column if it exists as it doesn't contribute to yield prediction
	if 'date' in X.columns:
		X = X.drop(columns=['date'])
		print("Removed 'date' column as it doesn't contribute to yield prediction")
	
	numeric_features = [c for c in X.columns if pd.api.types.is_numeric_dtype(X[c])]
	categorical_features = [c for c in X.columns if c not in numeric_features]
	return X, y, numeric_features, categorical_features


def build_preprocessor(numeric_features: List[str], categorical_features: List[str]) -> ColumnTransformer:
	numeric_pipe = Pipeline(steps=[
		("imputer", SimpleImputer(strategy="median")),
		("scaler", StandardScaler(with_mean=True, with_std=True)),
	])
	categorical_pipe = Pipeline(steps=[
		("imputer", SimpleImputer(strategy="most_frequent")),
		("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
	])
	preprocessor = ColumnTransformer(
		transformers=[
			("num", numeric_pipe, numeric_features),
			("cat", categorical_pipe, categorical_features),
		], remainder="drop",
	)
	return preprocessor


def load_and_preprocess(csv_path: str, target: Optional[str] = None, test_size: float = 0.2, random_state: int = 42):
    # Some datasets may have a label row before the actual header. Try robust loading.
    df = pd.read_csv(csv_path)
    # If the first column name looks like a file label, reload skipping the first row
    if any(isinstance(c, str) and "DataQuestDataset" in c for c in df.columns):
        df = pd.read_csv(csv_path, skiprows=1)
    inferred_target = infer_target_column(df, target)
    X, y, numeric_features, categorical_features = split_features(df, inferred_target)
    preprocessor = build_preprocessor(numeric_features, categorical_features)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    return {
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
        "preprocessor": preprocessor,
        "feature_names": X.columns.tolist(),
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "target": inferred_target,
    }


def safe_import_xgb():
    try:
        from xgboost import XGBRegressor
        return XGBRegressor
    except Exception:
        return None


def safe_import_lgbm():
    try:
        from lightgbm import LGBMRegressor
        return LGBMRegressor
    except Exception:
        return None


def safe_import_catboost():
    try:
        from catboost import CatBoostRegressor
        return CatBoostRegressor
    except Exception:
        return None


def rmse(y_true, y_pred):
    return float(np.sqrt(mean_squared_error(y_true, y_pred)))


def evaluate_model(name: str, model, X_test, y_test) -> Dict[str, float]:
    y_pred = model.predict(X_test)
    return {
        "rmse": rmse(y_test, y_pred),
        "mae": float(mean_absolute_error(y_test, y_pred)),
        "r2": float(r2_score(y_test, y_pred)),
    }


def get_model_definitions(random_state: int = 42) -> List[Tuple[str, object]]:
    models: List[Tuple[str, object]] = []
    models.append(("LinearRegression", LinearRegression()))
    models.append(("Ridge", Ridge(alpha=1.0, random_state=random_state)))
    models.append(("Lasso", Lasso(alpha=0.001, max_iter=20000, random_state=random_state)))
    models.append(("RandomForest", RandomForestRegressor(n_estimators=1000, max_depth=None, min_samples_split=2, min_samples_leaf=1, random_state=random_state, n_jobs=-1)))
    XGB = safe_import_xgb()
    if XGB is not None:
        models.append(("XGBoost", XGB(n_estimators=1500, learning_rate=0.03, max_depth=8, subsample=0.8, colsample_bytree=0.8, reg_alpha=0.1, reg_lambda=1.0, random_state=random_state, n_jobs=-1, tree_method="hist")))
    LGBM = safe_import_lgbm()
    if LGBM is not None:
        models.append(("LightGBM", LGBM(n_estimators=2000, learning_rate=0.03, num_leaves=63, subsample=0.9, colsample_bytree=0.8, reg_alpha=0.1, reg_lambda=0.1, random_state=random_state, n_jobs=-1)))
    CatB = safe_import_catboost()
    if CatB is not None:
        models.append(("CatBoost", CatB(iterations=2000, learning_rate=0.03, depth=8, loss_function="RMSE", random_seed=random_state, verbose=False)))
    return models


def _build_sample_weights(X: pd.DataFrame) -> Optional[np.ndarray]:
    """Apply slight upweighting ONLY to crops that are unequivocally rainfall-sensitive (YES).
    Based on the provided guidance: YES = {Barley, Sugarcane}. Others receive weight 1.0.
    """
    if "crop_type" not in X.columns:
        return None
    # Slight emphasis as requested
    yes_weight = 1.3
    weights = np.ones(len(X), dtype=float)
    crop_series = X["crop_type"].astype(str).str.strip().str.title()
    mask_yes = crop_series.isin(["Barley", "Sugarcane"])
    weights[mask_yes.values] = yes_weight
    return weights


def train_and_evaluate(prep_bundle: dict, random_state: int = 42):
    X_train = prep_bundle["X_train"]
    X_test = prep_bundle["X_test"]
    y_train = prep_bundle["y_train"]
    y_test = prep_bundle["y_test"]
    preprocessor = prep_bundle["preprocessor"]
    models = get_model_definitions(random_state)
    results: Dict[str, Dict[str, float]] = {}
    trained: Dict[str, Pipeline] = {}
    # Compute sample weights (train only). If None, train unweighted.
    sample_weights = _build_sample_weights(X_train)
    for name, base_model in models:
        pipe = Pipeline(steps=[("preprocessor", preprocessor), ("model", base_model)])
        # Try to fit with weights when supported; fall back gracefully otherwise.
        if sample_weights is not None:
            try:
                pipe.fit(X_train, y_train, model__sample_weight=sample_weights)
            except Exception:
                pipe.fit(X_train, y_train)
        else:
            pipe.fit(X_train, y_train)
        metrics = evaluate_model(name, pipe, X_test, y_test)
        results[name] = metrics
        trained[name] = pipe
    best_name = sorted(results.items(), key=lambda kv: (kv[1]["rmse"], -kv[1]["r2"]))[0][0]
    best_model = trained[best_name]
    return best_name, best_model, results


def feature_importance(model: Pipeline, numeric_features: List[str], categorical_features: List[str]) -> Optional[pd.DataFrame]:
    final_est = model.named_steps.get("model")
    ohe = model.named_steps["preprocessor"].named_transformers_.get("cat")
    cat_names = []
    if ohe is not None and hasattr(ohe.named_steps.get("encoder"), "get_feature_names_out"):
        enc = ohe.named_steps.get("encoder")
        cat_names = list(enc.get_feature_names_out(categorical_features))
    all_features = list(numeric_features) + cat_names
    if hasattr(final_est, "feature_importances_"):
        vals = final_est.feature_importances_
        return pd.DataFrame({"feature": all_features[: len(vals)], "importance": vals}).sort_values("importance", ascending=False)
    if hasattr(final_est, "coef_"):
        coef = final_est.coef_
        if coef.ndim > 1:
            coef = coef.ravel()
        return pd.DataFrame({"feature": all_features[: len(coef)], "importance": np.abs(coef)}).sort_values("importance", ascending=False)
    return None


def save_model(model: Pipeline, path: str):
    joblib.dump(model, path)


def main():
    parser = argparse.ArgumentParser()
	parser.add_argument("--csv", default="DataQuestDatasetFinal.csv")
    parser.add_argument("--target", default=None)
    parser.add_argument("--test_size", type=float, default=0.2)
    parser.add_argument("--random_state", type=int, default=42)
    parser.add_argument("--out", default="yield_model.pkl")
    args = parser.parse_args()
    prep_bundle = load_and_preprocess(args.csv, args.target, args.test_size, args.random_state)
    best_name, best_model, results = train_and_evaluate(prep_bundle, args.random_state)
    save_model(best_model, args.out)
    print("Best model:", best_name)
    print(json.dumps(results, indent=2))
    fi = feature_importance(best_model, prep_bundle["numeric_features"], prep_bundle["categorical_features"])
    if fi is not None:
        print(fi.head(30).to_string(index=False))


if __name__ == "__main__":
	main()

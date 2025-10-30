import joblib
import pandas as pd
import numpy as np
import argparse

def load_model(model_path: str = "yield_model.pkl"):
    """Load the trained model from file"""
    try:
        model = joblib.load(model_path)
        print(f"✅ Model loaded successfully from {model_path}")
        return model
    except FileNotFoundError:
        print(f"❌ Model file {model_path} not found. Please train the model first.")
        return None
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

def predict_from_csv(model, csv_path: str, output_path: str = None):
    """Make predictions from CSV file"""
    try:
        # Read CSV file
        df = pd.read_csv(csv_path)
        print(f"📊 Loaded {len(df)} records from {csv_path}")
        
        # Check if date column exists and remove it
        if 'date' in df.columns:
            df = df.drop(columns=['date'])
            print("🗑️ Removed 'date' column")
        
        # Check if target column exists and remove it
        target_columns = ['crop_yield', 'yield', 'target', 'label']
        target_found = None
        for col in target_columns:
            if col in df.columns:
                target_found = col
                break
        
        if target_found:
            actual_yields = df[target_found].copy()
            df = df.drop(columns=[target_found])
            print(f"📈 Found actual yields in column '{target_found}'")
        else:
            actual_yields = None
            print("ℹ️ No target column found - making predictions only")
        
        # Make predictions
        print("🔄 Making predictions...")
        predictions = model.predict(df)
        
        # Create results DataFrame
        results_df = df.copy()
        results_df['predicted_yield'] = predictions
        
        if actual_yields is not None:
            results_df['actual_yield'] = actual_yields
            results_df['error'] = np.abs(predictions - actual_yields)
            results_df['error_percent'] = (results_df['error'] / actual_yields) * 100
        
        # Display summary
        print("\n" + "=" * 60)
        print("📊 PREDICTION SUMMARY")
        print("=" * 60)
        print(f"Total predictions: {len(predictions)}")
        print(f"Average predicted yield: {np.mean(predictions):.2f}")
        print(f"Min predicted yield: {np.min(predictions):.2f}")
        print(f"Max predicted yield: {np.max(predictions):.2f}")
        
        if actual_yields is not None:
            mae = np.mean(np.abs(predictions - actual_yields))
            rmse = np.sqrt(np.mean((predictions - actual_yields) ** 2))
            print(f"Mean Absolute Error: {mae:.2f}")
            print(f"Root Mean Square Error: {rmse:.2f}")
        
        # Save results
        if output_path:
            results_df.to_csv(output_path, index=False)
            print(f"\n💾 Results saved to: {output_path}")
        else:
            output_path = csv_path.replace('.csv', '_predictions.csv')
            results_df.to_csv(output_path, index=False)
            print(f"\n💾 Results saved to: {output_path}")
        
        # Show first few results
        print(f"\n📋 First 5 predictions:")
        display_cols = ['crop_type', 'soil_type', 'temperature', 'avg_rainfall', 'predicted_yield']
        if actual_yields is not None:
            display_cols.append('actual_yield')
            display_cols.append('error')
        
        print(results_df[display_cols].head().to_string(index=False))
        
        return results_df
        
    except Exception as e:
        print(f"❌ Error processing CSV: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Predict crop yield from CSV file")
    parser.add_argument("--csv", required=True, help="Path to input CSV file")
    parser.add_argument("--model", default="yield_model.pkl", help="Path to trained model")
    parser.add_argument("--output", help="Path to output CSV file (optional)")
    
    args = parser.parse_args()
    
    print("🚀 Loading Crop Yield Prediction Model...")
    
    # Load the trained model
    model = load_model(args.model)
    if model is None:
        return
    
    # Make predictions from CSV
    results = predict_from_csv(model, args.csv, args.output)
    
    if results is not None:
        print("\n✅ Prediction completed successfully!")

if __name__ == "__main__":
    main()

import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any

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

def _expected_feature_columns(model) -> Dict[str, Any]:
    """Extract expected feature column names from the fitted pipeline's preprocessor.
    Returns a dict with keys: numeric_features, categorical_features, all_features
    """
    try:
        pre = model.named_steps.get("preprocessor")
        if pre is None:
            return {"numeric_features": [], "categorical_features": [], "all_features": []}
        transformers = pre.transformers_
        num_cols = []
        cat_cols = []
        for name, trans, cols in transformers:
            if name == "num":
                num_cols = list(cols)
            elif name == "cat":
                cat_cols = list(cols)
        return {
            "numeric_features": num_cols,
            "categorical_features": cat_cols,
            "all_features": list(num_cols) + list(cat_cols),
        }
    except Exception:
        return {"numeric_features": [], "categorical_features": [], "all_features": []}

def _align_input_to_model(model, input_data: Dict[str, Any]) -> pd.DataFrame:
    """Create a single-row DataFrame that matches the model's expected training columns.
    Any missing columns are added with NaN so imputers can fill them.
    Extra keys in input_data are ignored.
    """
    cols = _expected_feature_columns(model)
    expected = cols.get("all_features", [])
    df = pd.DataFrame([input_data])
    # Add any missing columns with NaN; keep only expected columns
    for c in expected:
        if c not in df.columns:
            df[c] = np.nan
    if expected:
        df = df[expected]
    return df

def get_user_input() -> Dict[str, Any]:
    """Get user input for prediction"""
    print("\n🌾 CROP YIELD PREDICTION")
    print("=" * 50)
    print("Enter the following details for yield prediction:\n")
    
    # Crop type
    crop_types = ['Barley', 'Corn', 'Cotton', 'Potato', 'Rice', 'Soybean', 'Sugarcane', 'Sunflower', 'Tomato', 'Wheat']
    print("Available crop types:", ", ".join(crop_types))
    crop_type = input("Crop Type: ").strip()
    while crop_type not in crop_types:
        print("Invalid crop type. Please choose from the available options.")
        crop_type = input("Crop Type: ").strip()
    
    # Soil type
    soil_types = ['Clay', 'Loamy', 'Peaty', 'Sandy', 'Saline']
    print("\nAvailable soil types:", ", ".join(soil_types))
    soil_type = input("Soil Type: ").strip()
    while soil_type not in soil_types:
        print("Invalid soil type. Please choose from the available options.")
        soil_type = input("Soil Type: ").strip()
    
    # Numeric inputs with validation
    print("\nEnter numeric values:")
    
    soil_ph = float(input("Soil pH (4.0-9.0): "))
    while not (4.0 <= soil_ph <= 9.0):
        print("❌ Soil pH should be between 4.0 and 9.0")
        soil_ph = float(input("Soil pH (4.0-9.0): "))
    
    temperature = float(input("Temperature (°C): "))
    while not (0 <= temperature <= 50):
        print("❌ Temperature should be between 0 and 50°C")
        temperature = float(input("Temperature (°C): "))
    
    humidity = float(input("Humidity (%): "))
    while not (0 <= humidity <= 100):
        print("❌ Humidity should be between 0 and 100%")
        humidity = float(input("Humidity (%): "))
    
    wind_speed = float(input("Wind Speed (km/h): "))
    while not (0 <= wind_speed <= 50):
        print("❌ Wind speed should be between 0 and 50 km/h")
        wind_speed = float(input("Wind Speed (km/h): "))
    
    n = float(input("Nitrogen (N) content: "))
    while not (0 <= n <= 200):
        print("❌ Nitrogen content should be between 0 and 200")
        n = float(input("Nitrogen (N) content: "))
    
    p = float(input("Phosphorus (P) content: "))
    while not (0 <= p <= 200):
        print("❌ Phosphorus content should be between 0 and 200")
        p = float(input("Phosphorus (P) content: "))
    
    k = float(input("Potassium (K) content: "))
    while not (0 <= k <= 200):
        print("❌ Potassium content should be between 0 and 200")
        k = float(input("Potassium (K) content: "))
    
    soil_quality = float(input("Soil Quality (0-100): "))
    while not (0 <= soil_quality <= 100):
        print("❌ Soil quality should be between 0 and 100")
        soil_quality = float(input("Soil Quality (0-100): "))

    # Rainfall inputs
    avg_rainfall = float(input("Average seasonal rainfall (mm): "))
    while not (0 <= avg_rainfall <= 10000):
        print("❌ Average rainfall should be between 0 and 10000 mm")
        avg_rainfall = float(input("Average seasonal rainfall (mm): "))
    
    return {
        'crop_type': crop_type,
        'soil_type': soil_type,
        'soil_ph': soil_ph,
        'temperature': temperature,
        'humidity': humidity,
        'wind_speed': wind_speed,
        'n': n,
        'p': p,
        'k': k,
        'soil_quality': soil_quality,
        'avg_rainfall': avg_rainfall
    }

def predict_yield(model, input_data: Dict[str, Any]) -> float:
    """Make prediction using the trained model"""
    try:
        # Align DataFrame to model's expected features (adds missing columns like year/state/avg_rainfall_mm)
        df = _align_input_to_model(model, input_data)
        
        # Make prediction
        prediction = model.predict(df)[0]
        
        return prediction
    except Exception as e:
        print(f"❌ Error making prediction: {e}")
        return None

def display_results(input_data: Dict[str, Any], prediction: float):
    """Display input data and prediction results"""
    print("\n" + "=" * 60)
    print("📊 PREDICTION RESULTS")
    print("=" * 60)
    
    print("\n📋 INPUT DATA:")
    print(f"  Crop Type: {input_data['crop_type']}")
    print(f"  Soil Type: {input_data['soil_type']}")
    print(f"  Soil pH: {input_data['soil_ph']}")
    print(f"  Temperature: {input_data['temperature']}°C")
    print(f"  Humidity: {input_data['humidity']}%")
    print(f"  Wind Speed: {input_data['wind_speed']} km/h")
    print(f"  Nitrogen (N): {input_data['n']}")
    print(f"  Phosphorus (P): {input_data['p']}")
    print(f"  Potassium (K): {input_data['k']}")
    print(f"  Soil Quality: {input_data['soil_quality']}")
    
    print(f"\n🌾 PREDICTED CROP YIELD: {prediction:.2f} units")
    
    # Provide interpretation
 
def main():
    """Main function to run the prediction script"""
    print("🚀 Loading Crop Yield Prediction Model...")
    
    # Load the trained model
    model = load_model()
    if model is None:
        return
    
    try:
        while True:
            # Get user input
            input_data = get_user_input()
            
            # Make prediction
            print("\n🔄 Making prediction...")
            prediction = predict_yield(model, input_data)
            
            if prediction is not None:
                # Display results
                display_results(input_data, prediction)
            
            # Ask if user wants to make another prediction
            print("\n" + "=" * 60)
            another = input("Would you like to make another prediction? (y/n): ").strip().lower()
            if another not in ['y', 'yes']:
                break
        
        print("\n👋 Thank you for using the Crop Yield Prediction System!")
        
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")

if __name__ == "__main__":
    main()

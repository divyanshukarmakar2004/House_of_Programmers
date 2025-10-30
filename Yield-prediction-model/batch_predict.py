import joblib
import pandas as pd
import numpy as np

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

def predict_batch(model, input_data_list):
    """Make predictions for multiple inputs"""
    try:
        # Create DataFrame from list of input data
        df = pd.DataFrame(input_data_list)
        
        # Make predictions
        predictions = model.predict(df)
        
        return predictions
    except Exception as e:
        print(f"❌ Error making predictions: {e}")
        return None

def main():
    """Example usage with sample data"""
    print("🚀 Loading Crop Yield Prediction Model...")
    
    # Load the trained model
    model = load_model()
    if model is None:
        return
    
    # Sample test data - you can modify these values
    test_data = [
        {
            'crop_type': 'Tomato',
            'soil_type': 'Loamy',
            'soil_ph': 6.5,
            'temperature': 25.0,
            'humidity': 70.0,
            'wind_speed': 10.0,
            'n': 80.0,
            'p': 60.0,
            'k': 50.0,
            'soil_quality': 75.0,
            'avg_rainfall': 800.0
        },
        {
            'crop_type': 'Rice',
            'soil_type': 'Clay',
            'soil_ph': 6.0,
            'temperature': 28.0,
            'humidity': 85.0,
            'wind_speed': 5.0,
            'n': 90.0,
            'p': 70.0,
            'k': 60.0,
            'soil_quality': 80.0,
            'avg_rainfall': 1200.0
        },
        {
            'crop_type': 'Wheat',
            'soil_type': 'Sandy',
            'soil_ph': 7.0,
            'temperature': 20.0,
            'humidity': 60.0,
            'wind_speed': 15.0,
            'n': 70.0,
            'p': 50.0,
            'k': 40.0,
            'soil_quality': 65.0,
            'avg_rainfall': 600.0
        }
    ]
    
    print(f"\n📊 Making predictions for {len(test_data)} test cases...")
    
    # Make predictions
    predictions = predict_batch(model, test_data)
    
    if predictions is not None:
        print("\n" + "=" * 80)
        print("📋 BATCH PREDICTION RESULTS")
        print("=" * 80)
        
        for i, (data, pred) in enumerate(zip(test_data, predictions), 1):
            print(f"\n🌾 Test Case {i}:")
            print(f"  Crop: {data['crop_type']} | Soil: {data['soil_type']} | Temp: {data['temperature']}°C")
            print(f"  Predicted Yield: {pred:.2f} units")
            
            # Yield level interpretation
            if pred < 20:
                level = "Low 🔴"
            elif pred < 50:
                level = "Medium 🟡"
            else:
                level = "High 🟢"
            print(f"  Yield Level: {level}")
    
    print("\n" + "=" * 80)
    print("💡 To test with your own data:")
    print("   1. Run: python predict_yield.py (for interactive input)")
    print("   2. Modify the test_data list in this script for batch testing")
    print("   3. Create a CSV file with your data and modify the script to read it")

if __name__ == "__main__":
    main()

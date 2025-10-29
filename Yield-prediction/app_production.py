from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import joblib
import pandas as pd
import numpy as np
import os
from typing import Dict, Any, List
import json

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

# Global variable to store the loaded model
model = None

def load_model(model_path: str = "yield_model.pkl"):
    """Load the trained model from file"""
    global model
    try:
        # Check if file exists
        if not os.path.exists(model_path):
            print(f"❌ Model file {model_path} not found in current directory: {os.getcwd()}")
            print(f"❌ Available files: {os.listdir('.')}")
            return False
            
        model = joblib.load(model_path)
        print(f"✅ Model loaded successfully from {model_path}")
        print(f"✅ Model type: {type(model)}")
        return True
    except FileNotFoundError:
        print(f"❌ Model file {model_path} not found. Please train the model first.")
        print(f"❌ Current directory: {os.getcwd()}")
        print(f"❌ Available files: {os.listdir('.')}")
        return False
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print(f"❌ Error type: {type(e)}")
        return False

def _expected_feature_columns(model) -> Dict[str, Any]:
    """Extract expected feature column names from the fitted pipeline's preprocessor."""
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
    """Create a single-row DataFrame that matches the model's expected training columns."""
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

def predict_yield(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Make prediction using the trained model"""
    global model
    if model is None:
        return {"error": "Model not loaded"}
    
    try:
        # Align DataFrame to model's expected features
        df = _align_input_to_model(model, input_data)
        
        # Make prediction
        prediction = model.predict(df)[0]
        
        return {
            "prediction": float(prediction),
            "status": "success"
        }
    except Exception as e:
        return {
            "error": f"Error making prediction: {str(e)}",
            "status": "error"
        }

@app.route('/')
def index():
    """Main page with prediction form"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """API endpoint for single prediction"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['crop_type', 'soil_type', 'soil_ph', 'temperature', 
                          'humidity', 'wind_speed', 'n', 'p', 'k', 'soil_quality', 'avg_rainfall']
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Make prediction
        result = predict_yield(data)
        
        if result.get("status") == "error":
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict_form', methods=['POST'])
def predict_form():
    """Handle form submission for web interface"""
    try:
        # Get form data
        input_data = {
            'crop_type': request.form['crop_type'],
            'soil_type': request.form['soil_type'],
            'soil_ph': float(request.form['soil_ph']),
            'temperature': float(request.form['temperature']),
            'humidity': float(request.form['humidity']),
            'wind_speed': float(request.form['wind_speed']),
            'n': float(request.form['n']),
            'p': float(request.form['p']),
            'k': float(request.form['k']),
            'soil_quality': float(request.form['soil_quality']),
            'avg_rainfall': float(request.form['avg_rainfall'])
        }
        
        # Make prediction
        result = predict_yield(input_data)
        
        if result.get("status") == "error":
            flash(f"Error: {result.get('error')}", 'error')
            return redirect(url_for('index'))
        
        # Store result in session for display
        flash(f"Predicted Yield: {result['prediction']:.2f} units", 'success')
        return redirect(url_for('index'))
        
    except Exception as e:
        flash(f"Error: {str(e)}", 'error')
        return redirect(url_for('index'))

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """API endpoint for batch predictions"""
    try:
        data = request.get_json()
        
        if 'data' not in data or not isinstance(data['data'], list):
            return jsonify({"error": "Expected 'data' field with list of input objects"}), 400
        
        predictions = []
        errors = []
        
        for i, input_data in enumerate(data['data']):
            result = predict_yield(input_data)
            if result.get("status") == "success":
                predictions.append({
                    "index": i,
                    "prediction": result["prediction"],
                    "input": input_data
                })
            else:
                errors.append({
                    "index": i,
                    "error": result.get("error", "Unknown error"),
                    "input": input_data
                })
        
        return jsonify({
            "predictions": predictions,
            "errors": errors,
            "total_processed": len(data['data']),
            "successful": len(predictions),
            "failed": len(errors)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/csv_predict', methods=['POST'])
def csv_predict():
    """API endpoint for CSV file predictions"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be a CSV"}), 400
        
        # Read CSV
        df = pd.read_csv(file)
        
        # Remove date column if exists
        if 'date' in df.columns:
            df = df.drop(columns=['date'])
        
        # Remove target columns if they exist
        target_columns = ['crop_yield', 'yield', 'target', 'label']
        for col in target_columns:
            if col in df.columns:
                df = df.drop(columns=[col])
        
        # Convert to list of dictionaries
        data_list = df.to_dict('records')
        
        # Make predictions
        predictions = []
        for i, input_data in enumerate(data_list):
            result = predict_yield(input_data)
            if result.get("status") == "success":
                predictions.append({
                    "index": i,
                    "prediction": result["prediction"],
                    "input": input_data
                })
        
        return jsonify({
            "predictions": predictions,
            "total_processed": len(data_list),
            "successful": len(predictions)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/model_info')
def model_info():
    """Get information about the loaded model"""
    global model
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        feature_info = _expected_feature_columns(model)
        
        return jsonify({
            "model_loaded": True,
            "feature_info": feature_info,
            "model_type": type(model.named_steps.get("model")).__name__ if model.named_steps.get("model") else "Unknown"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api_docs')
def api_docs():
    """API documentation page"""
    return render_template('api_docs.html')

@app.route('/test_endpoints')
def test_endpoints():
    """Test page for API endpoints"""
    return render_template('test_endpoints.html')

@app.route('/reload_model', methods=['POST'])
def reload_model():
    """Manually reload the model"""
    global model
    try:
        success = load_model()
        if success:
            return jsonify({"status": "success", "message": "Model reloaded successfully"})
        else:
            return jsonify({"status": "error", "message": "Failed to reload model"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/health')
def health():
    """Health check endpoint for Render"""
    return jsonify({
        "status": "healthy", 
        "model_loaded": model is not None,
        "current_directory": os.getcwd(),
        "available_files": os.listdir('.') if os.path.exists('.') else [],
        "model_file_exists": os.path.exists("yield_model.pkl")
    })

if __name__ == '__main__':
    # Load model on startup
    if not load_model():
        print("⚠️ Warning: Model could not be loaded. Some features may not work.")
    
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get('PORT', 5000))
    
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=False)

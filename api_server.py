from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from detect_components import detect_chip_components

app = Flask(__name__)
# Enable CORS so the React app running on port 5173 can query this server on port 5000
CORS(app)

# Load regression model
model_path = 'vlsi_regressor.joblib'
regressor = None
if os.path.exists(model_path):
    regressor = joblib.load(model_path)
    print("VLSI Regressor model loaded.")
else:
    print("Warning: Model file not found. Please run: python predict_details.py first.")

@app.route('/api/predict', methods=['POST'])
def predict():
    global regressor
    # Double check loading if trained on the fly
    if regressor is None and os.path.exists(model_path):
        regressor = joblib.load(model_path)

    if regressor is None:
        return jsonify({"error": "Regressor model not trained. Please run predict_details.py"}), 500
        
    data = request.json
    cell_count = data.get('cell_count', 100)
    seq_ratio = data.get('seq_ratio', 0.1)
    tech_node = data.get('tech_node', 45)
    voltage = data.get('voltage', 1.1)
    frequency = data.get('frequency', 500)
    
    # Predict using the Joblib loaded Random Forest model
    features = np.array([[cell_count, seq_ratio, tech_node, voltage, frequency]])
    prediction = regressor.predict(features)[0]
    
    return jsonify({
        "area": float(prediction[0]),
        "delay": float(prediction[1]),
        "power": float(prediction[2])
    })

@app.route('/api/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
        
    file = request.files['image']
    os.makedirs('temp', exist_ok=True)
    temp_path = os.path.join('temp', file.filename)
    file.save(temp_path)
    
    # Run the OpenCV matching logic
    results = detect_chip_components(temp_path, 'templates')
    
    # Clean up temporary uploaded file
    if os.path.exists(temp_path):
        os.remove(temp_path)
        
    return jsonify(results)

if __name__ == '__main__':
    # Start server on local port 5000
    app.run(port=5000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load('ipl_model.pkl')  # Load your pre-trained model
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Flask API!"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    print("\nReceived data:\n", data)

    input = pd.DataFrame({
        'batting_team': [data.get('batting_team')],
        'bowling_team': [data.get('bowling_team')],
        'city': [data.get('city')],
        'runs_left': [data.get('runs_left')],
        'wickets': [data.get('wickets')],
        'balls_left': [data.get('balls_left')],
        'total_runs': [data.get('total_runs')],
        'crr' : [data.get('crr')],
        'rrr' : [data.get('rrr')],
    })    

    print("\nInput DataFrame:\n", input)

    prediction = model.predict_proba(input)

    return jsonify({"message": "Prediction successful!", "prediction": prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
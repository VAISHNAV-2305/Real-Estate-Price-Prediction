from flask import Flask, request, jsonify, render_template
import pickle
import json
import numpy as np

app = Flask(__name__)

# Load model and data columns
model = pickle.load(open('banglore_home_prices_model.pickle', 'rb'))
with open('columns.json', 'r') as f:
    data_columns = json.load(f)['data_columns']
    locations = data_columns[3:]  # Skip sqft, bath, bhk

@app.route('/')
def home():
    return render_template('index.html', locations=locations)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        location = data['location']
        sqft = float(data['sqft'])
        bhk = int(data['bhk'])
        bath = int(data['bath'])

        x = np.zeros(len(data_columns))
        x[0] = sqft
        x[1] = bath
        x[2] = bhk
        if location in data_columns:
            loc_index = data_columns.index(location)
            x[loc_index] = 1

        prediction = model.predict([x])[0]
        return jsonify({'estimated_price': round(prediction, 2)})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == "__main__":
    app.run(debug=True)

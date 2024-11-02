from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.optimizers import Adam
import numpy as np
import io

app = Flask(__name__)

# Load the model
MODEL_PATH = 'aug_model.weights.best.hdf5'
try:
    model = load_model(MODEL_PATH, compile=False)
    model.compile(optimizer=Adam(learning_rate=1e-4), loss='binary_crossentropy', metrics=['accuracy'])
    print("Model loaded and compiled successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not loaded successfully.'}), 500

    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file found in the request.'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file.'}), 400

        img = image.load_img(io.BytesIO(file.read()), target_size=(150, 150))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0) / 255.0

        prediction = model.predict(x)
        predicted_percentage = float(prediction[0][1] * 100)

        return jsonify({'prediction': round(predicted_percentage, 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000, debug=True)

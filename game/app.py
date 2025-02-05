from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from deepface import DeepFace
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def save_mood(mood):
    with open("mood.json", "w") as f:
        json.dump({"mood": mood}, f)

def get_last_mood():
    try:
        with open("mood.json", "r") as f:
            return json.load(f).get("mood", None)
    except FileNotFoundError:
        return None


@app.route('/detect-mood', methods=['POST'])
def detect_mood():
    try:
        data = request.json
        # Decode the base64 image data
        image_data = data['image'].split(',')[1]
        image = np.frombuffer(base64.b64decode(image_data), np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        # Analyze the image
        result = DeepFace.analyze(image, actions=['emotion'])

        # Access the first result if it's a list
        if isinstance(result, list):
            result = result[0]

        mood = result['dominant_emotion']
        # save_mood(mood)

        print(mood)
        return jsonify({'mood': mood})
    except Exception as e:
        print(f"Error analyzing mood: {e}")  # Log the error
        return jsonify({'error': str(e)}), 500


def last_mood():
    mood = get_last_mood()
    if mood:
        return jsonify({"mood": mood})
    else:
        return jsonify({"error": "No mood detected"}), 404


if __name__ == '__main__':
    app.run(port=5002, debug=True)

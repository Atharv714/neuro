from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask_cors import CORS
import openai
import time
import os
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Firebase Admin SDK
cred = credentials.Certificate('backend/json/firebaseadmin.json')  # Replace with your JSON file path
firebase_admin.initialize_app(cred)

@app.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email')
    password = request.json.get('password')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    full_name = f"{first_name} {last_name}"
    try:
        # Create the user with email, password, and full_name (display_name in Firebase)
        user = auth.create_user(email=email, password=password, display_name=full_name)
        return jsonify({"message": "User created successfully", "uid": user.uid, "name": user.display_name}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/signin', methods=['POST'])
def signin():
    access_token = request.json.get('accessToken')
    try:
        # Use the access token to get user information from the Google API
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info_endpoint = "https://www.googleapis.com/oauth2/v1/userinfo"
        response = requests.get(user_info_endpoint, headers=headers)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch user info", "details": response.text}), response.status_code
        
        user_info = response.json()
        user_name = user_info.get("name", "Unknown User")
        
        # Return user info to frontend
        return jsonify({
            "message": "User signed in successfully",
            "name": user_name,
            "email": user_info.get("email"),
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401



db = firestore.client()

conversations = {}

# Helper function to save diagnosis data to Firestore
def save_diagnosis_data(user_id, diagnosis_data):
    try:
        doc_ref = db.collection('diagnosis').document(user_id).collection('history').document()
        doc_ref.set(diagnosis_data)
        return True
    except Exception as e:
        print(f"Error saving to Firestore: {str(e)}")
        return False

# Helper function to open files
def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as infile:
        return infile.read()

# Helper function to communicate with OpenAI's API
def chatbot(conversation, model="gpt-4o-mini", temperature=0, max_tokens=2000):
    while True:
        try:
            response = openai.ChatCompletion.create(
                model=model, messages=conversation, temperature=temperature, max_tokens=max_tokens
            )
            text = response['choices'][0]['message']['content']
            return text, response['usage']['total_tokens']
        except Exception as oops:
            print(f'Error communicating with OpenAI: "{oops}"')
            time.sleep(1)

# AI Diagnosis Route
@app.route('/aidiagnosis', methods=['POST'])
def ai_diagnosis():
    user_id = request.json.get('user_id')
    user_message = request.json.get('message')

    # Initialize conversation if it doesn't exist for the user
    if user_id not in conversations:
        conversations[user_id] = [{'role': 'system', 'content': open_file('backend/medical_notes/system_01_intake.md')}]

    # Check if the user wants to end the chat
    if user_message.lower() == 'done':
        # Step 2: Generating Intake Notes
        conversation = conversations[user_id]
        conversation.append({'role': 'system', 'content': open_file('backend/medical_notes/system_02_prepare_notes.md')})
        chat_log = '<<BEGIN PATIENT INTAKE CHAT>>\n' + '\n'.join([f"{msg['role'].upper()}: {msg['content']}" for msg in conversation if msg['role'] == 'user']) + '\n<<END PATIENT INTAKE CHAT>>'
        conversation.append({'role': 'user', 'content': chat_log})
        notes, _ = chatbot(conversation)

        # Step 3: Generating Hypothesis Report
        conversation.append({'role': 'system', 'content': open_file('backend/medical_notes/system_03_diagnosis.md')})
        conversation.append({'role': 'user', 'content': notes})
        report, _ = chatbot(conversation)

        # Step 4: Preparing for Clinical Evaluation
        conversation.append({'role': 'system', 'content': open_file('backend/medical_notes/system_04_clinical.md')})
        conversation.append({'role': 'user', 'content': notes})
        clinical, _ = chatbot(conversation)

        # Step 5: Generating Referrals and Tests
        conversation.append({'role': 'system', 'content': open_file('backend/medical_notes/system_05_referrals.md')})
        conversation.append({'role': 'user', 'content': notes})
        referrals, _ = chatbot(conversation)

        # Compile all data into a single dictionary
        diagnosis_data = {
            "chat_log": chat_log,
            "notes": notes,
            "report": report,
            "clinical": clinical,
            "referrals": referrals,
            "timestamp": time.time()
        }

        # Save diagnosis data to Firestore
        if save_diagnosis_data(user_id, diagnosis_data):
            # Clear the conversation for the user
            del conversations[user_id]
            return jsonify({"message": "Diagnosis completed and saved successfully", "data": diagnosis_data}), 200
        else:
            return jsonify({"error": "Failed to save data"}), 500

    # If user has not typed 'done', continue the chat
    conversations[user_id].append({'role': 'user', 'content': user_message})
    response, _ = chatbot(conversations[user_id])
    conversations[user_id].append({'role': 'assistant', 'content': response})
    
    return jsonify({"message": response}), 200

# New endpoint to fetch the latest diagnosis
@app.route('/get_diagnosis_result', methods=['GET'])
def get_diagnosis_result():
    user_id = request.args.get('user_id')
    try:
        doc_ref = db.collection('diagnosis').document(user_id).collection('history').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(1).get()
        if not doc_ref:
            return jsonify({"error": "No diagnosis found"}), 404
        
        diagnosis = doc_ref[0].to_dict()
        # Remove chat_log from the response
        diagnosis.pop('chat_log', None)
        return jsonify(diagnosis), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# route for handling fitness data
    
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# @app.route('/fitnessdata', methods=['POST'])
# def get_fitness_data():
#     user_id = request.json.get('user_id')
#     access_token = request.json.get('access_token')

#     try:
#         fitness_endpoint = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate"
#         headers = {"Authorization": f"Bearer {access_token}"}

#         request_body = {
#             "aggregateBy": [{"dataTypeName": "com.google.step_count.delta"}],
#             "bucketByTime": {"durationMillis": 86400000},  # Bucket by day
#             "startTimeMillis": 1609459200000,  # Example: January 1, 2021
#             "endTimeMillis": 1609545600000    # Example: January 2, 2021
#         }

#         response = requests.post(fitness_endpoint, headers=headers, json=request_body)

#         # Check if the request was successful
#         if response.status_code != 200:
#             print(f"Error fetching fitness data: {response.status_code} - {response.text}")
#             return jsonify({"error": "Failed to fetch fitness data", "details": response.text}), response.status_code

#         fitness_data = response.json()

#         # Save fitness data to Firestore
#         doc_ref = db.collection("fitness_data").document(user_id).collection('history').document()
#         doc_ref.set(fitness_data)

#         return jsonify({"message": "Fitness Data successfully fetched", "data": fitness_data}), 200

#     except Exception as e:
#         print(f"Exception in get_fitness_data: {str(e)}")
#         return jsonify({"error": str(e)}), 500

@app.route('/fitnessdata', methods=['POST'])
def get_fitness_data():
    access_token = request.json.get('access_token')
    
    # Print the access token to the console
    print(f"Received access token: {access_token}")

    try:
        fitness_endpoint = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate"
        headers = {"Authorization": f"Bearer {access_token}"}

        request_body = {
            "aggregateBy": [{"dataTypeName": "com.google.step_count.delta"}],
            "bucketByTime": {"durationMillis": 86400000},  # Bucket by day
            "startTimeMillis": 1609459200000,  # Example: January 1, 2021
            "endTimeMillis": 1609545600000    # Example: January 2, 2021
        }

        response = requests.post(fitness_endpoint, headers=headers, json=request_body)

        if response.status_code != 200:
            print(f"Error fetching fitness data: {response.status_code} - {response.text}")
            return jsonify({"error": "Failed to fetch fitness data", "details": response.text}), response.status_code

        fitness_data = response.json()

        # Save fitness data to Firestore
        user_id = request.json.get('user_id')
        doc_ref = db.collection("fitness_data").document(user_id).collection('history').document()
        doc_ref.set(fitness_data)

        return jsonify({"message": "Fitness Data successfully fetched", "data": fitness_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    openai.api_key = open_file('backend/key_openai.txt').strip()
    app.run(debug=True)



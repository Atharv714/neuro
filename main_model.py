from flask import Flask, request, jsonify, session, render_template
import os
import io
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-123")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


WHISPER_MODEL = "whisper-1"  
GPT4O_MODEL = "gpt-4o-mini-audio-preview" 
AVATAR_VOICE = "nova" 

with open('prompts.md', 'r', encoding='utf-8') as f:
    SYSTEM_PROMPT = f.read()

def get_conversation_history():
    """Get conversation history with null checks"""
    history = session.get("conversation_history", [])
    return [msg for msg in history if msg.get("content") is not None]

def update_conversation_history(role, content):
    """Update history with validation"""
    if not isinstance(content, str) or len(content.strip()) == 0:
        raise ValueError("Invalid message content")

    history = get_conversation_history()
    history.append({"role": role, "content": content.strip()})
    session["conversation_history"] = history[-6:]  # Keep last 3 exchanges


@app.route('/process', methods=['POST'])
def handle_audio():
    start_time = time.time()
    try:
        # Get the uploaded audio file
        audio_file = request.files['audio']
        
        # Create a file-like object from the uploaded data
        audio_bytes = audio_file.read()
        audio_file_like = io.BytesIO(audio_bytes)
        audio_file_like.name = "recording.webm" 

        # Transcribe using Whisper
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file_like,
            # prompt="transrcibe to english characters",
            response_format="text"
        )

        if not isinstance(transcript, str) or len(transcript.strip()) == 0:
            raise ValueError("Invalid audio transcription")

        update_conversation_history("user", transcript)



        update_conversation_history("user", transcript)
        
        completion = client.chat.completions.create(
            model="gpt-4o-mini-audio-preview",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *get_conversation_history()
            ],
            modalities=["text", "audio"],
            audio={"voice": AVATAR_VOICE, "format": "wav"},
            temperature=0.7,
        )

        # Handle response
        response = completion.choices[0].message
        print(completion.choices[0].message)
        return jsonify({
            'user_input': transcript,
            # 'bot_response': completion.choices[0].message,
            'audio': completion.choices[0].message.audio.data,
            'timing': round(time.time() - start_time, 2)
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/')
def index():
    return render_template('index5.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)

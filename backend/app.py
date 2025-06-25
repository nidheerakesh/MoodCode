from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash-002")

@app.route('/')
def home():
    return "MoodDecode API is running!"

@app.route('/analyze_mood', methods=['POST'])
def analyze_mood():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Text is required"}), 400

    prompt = f"Identify the primary emotion expressed in this text: \"{text}\". Respond with one word like happy, sad, angry, etc."
    response = model.generate_content(prompt)
    emotion = response.text.strip().lower()
    return jsonify({"emotion": emotion})

@app.route('/detect_crisis', methods=['POST'])
def detect_crisis():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Text is required"}), 400

    prompt = f"Does this text indicate a crisis, such as suicidal thoughts, self-harm, or severe distress? Respond only with true or false. Text: \"{text}\""
    response = model.generate_content(prompt)
    crisis_detected = "true" in response.text.lower()
    return jsonify({"crisis_detected": crisis_detected})

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Text is required"}), 400

    prompt = f"Please provide a short, clear summary of the following text:\n\"{text}\""
    response = model.generate_content(prompt)
    summary = response.text.strip()
    return jsonify({"summary": summary})

if __name__ == '__main__':
    app.run(debug=True)

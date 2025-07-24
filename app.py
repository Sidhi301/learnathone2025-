from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables CORS for frontend-backend communication

# Function to generate chatbot response based on message and language
def get_bot_response(msg, lang):
    msg = msg.lower()

    # Basic rule-based reply for 'fever'
    if "fever" in msg or "bukhar" in msg:
        responses = {
            "en": "Please drink plenty of fluids and rest. If fever persists, consult a doctor.",
            "hi": "कृपया खूब सारा पानी पीएं और आराम करें। अगर बुखार बना रहे तो डॉक्टर से मिलें।",
            "or": "ଦୟାକରି ଅଧିକ ପାଣି ପିଉନ୍ତୁ ଓ ବିଶ୍ରାମ କରନ୍ତୁ । ଜ୍ୱର ଥିଲେ ଡାକ୍ତରଙ୍କ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ ।",
            "te": "దయచేసి ఎక్కువగా ద్రవాలు తాగండి మరియు విశ్రాంతి తీసుకోండి. జ్వరము తగ్గకపోతే డాక్టర్‌ను సంప్రదించండి."
        }
    else:
        responses = {
            "en": "I’m here to help with your health questions!",
            "hi": "मैं आपकी स्वास्थ्य संबंधित प्रश्नों में सहायता कर सकता हूँ।",
            "or": "ମୁଁ ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ନିମନ୍ତେ ସାହାଯ୍ୟ କରିପାରିବି ।",
            "te": "మీ ఆరోగ్య సమస్యలకు నేను సహాయం చేస్తాను!"
        }

    return responses.get(lang, "Sorry, I don't understand your language yet.")

# Home route (renders the front-end page)
@app.route("/")
def index():
    return render_template("index.html")

# Chat route (handles AJAX POST request from frontend)
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    lang = request.json.get("lang", "en")  # Default to English
    bot_reply = get_bot_response(user_message, lang)
    return jsonify({"reply": bot_reply})

# Only run if script is directly executed (not when imported)
if __name__ == "__main__":
    app.run(debug=True)

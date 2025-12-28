from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# --- VERCEL PATH FIX (CRITICAL) ---
# This forces Python to look in the 'api' folder for modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Now imports will work
from data import beers, vodka, rum, whisky
from chat import chatbot

app = Flask(__name__)
CORS(app)

@app.route('/api/beers', methods=['GET'])
def get_beers():
    return jsonify(beers)

@app.route('/api/vodka', methods=['GET'])
def get_vodka():
    return jsonify(vodka)

@app.route('/api/rum', methods=['GET'])
def get_rum():
    return jsonify(rum)

@app.route('/api/whisky', methods=['GET'])
def get_whisky():
    return jsonify(whisky)

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.json
    user_query = data.get('query')
    
    if not user_query:
        return jsonify({"response": "Hey! Say something so I can help you plan the party."}), 400

    try:
        # Call the function from chat.py
        bot_response = chatbot(user_query)
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"response": f"Sorry, the bartender is busy. (Error: {str(e)})"}), 500
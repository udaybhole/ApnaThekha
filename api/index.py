from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
import json

# --- VERCEL PATH FIX (CRITICAL) ---
# This forces Python to look in the 'api' folder for modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Now imports will work
from data import beers, vodka, rum, whisky
from chat import chatbot

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

RATINGS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ratings.json')

def get_product_key(item):
    return str(item.get('id', item.get('name', '')))

def load_ratings():
    if os.path.exists(RATINGS_FILE):
        try:
            with open(RATINGS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_ratings(ratings):
    with open(RATINGS_FILE, 'w') as f:
        json.dump(ratings, f, indent=2)

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

@app.route('/api/ratings', methods=['GET'])
def get_ratings():
    try:
        ratings = load_ratings()
        return jsonify(ratings)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ratings', methods=['POST'])
def update_rating():
    try:
        data = request.json
        product_key = data.get('productKey')
        emoji = data.get('emoji')
        
        if not product_key or not emoji:
            return jsonify({"error": "productKey and emoji are required"}), 400
        
        if emoji not in ['👍', '👎', '❤️', '🔥']:
            return jsonify({"error": "Invalid emoji"}), 400
        
        ratings = load_ratings()
        
        if product_key not in ratings:
            ratings[product_key] = {'👍': 0, '👎': 0, '❤️': 0, '🔥': 0}
        
        ratings[product_key][emoji] = ratings[product_key].get(emoji, 0) + 1
        
        save_ratings(ratings)
        
        return jsonify(ratings[product_key])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
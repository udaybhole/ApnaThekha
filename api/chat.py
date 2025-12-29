import os
from dotenv import load_dotenv
from google import genai
import data  # Imports your data.py lists

# --- SETUP ---
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini Client
# Note: Vercel might not raise runtime errors for missing keys immediately, 
# but better to handle it safely.
client = None
if API_KEY:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Error initializing Gemini: {e}")

model_name = 'gemma-3-1b' 

# --- DATA PREPARATION ---
def format_menu():
    """Converts the python lists into a readable text menu for the AI."""
    menu_text = ""
    
    def add_category(name, items):
        nonlocal menu_text
        menu_text += f"\n--- {name.upper()} ---\n"
        for item in items:
            try:
                price = str(item['price']).replace(',', '').strip()
            except:
                price = "N/A"
            menu_text += f"- {item['name']} | Price: ₹{price} | Vol: {item['volume']}\n"

    # Safely access data lists
    add_category("Beer", getattr(data, 'beers', []))
    add_category("Vodka", getattr(data, 'vodka', []))
    add_category("Rum", getattr(data, 'rum', []))
    add_category("Whisky", getattr(data, 'whisky', []))
    
    return menu_text

FULL_MENU_CONTEXT = format_menu()

# --- CHATBOT FUNCTION ---
def chatbot(user_query):
    if not client:
        return "⚠️ Server Error: API Key missing. Please tell the admin to check Vercel settings."

    prompt = f"""
    You are the "ApnaTheka AI Bartender". 
    You have access to the COMPLETE inventory list below.

    INVENTORY:
    {FULL_MENU_CONTEXT}

    USER REQUEST: "{user_query}"

    INSTRUCTIONS:
    1. Identify the user's budget and vibe.
    2. STRICTLY select items where Total Cost <= Budget.
    3. Do the math (e.g., "1 Whisky (3000) + 4 Beers (250 each) = 4000").
    4. If the exact drink isn't there, suggest a similar one from the INVENTORY.
    5. Keep it short, fun, and use bullet points.
    """

    try:
        response = client.models.generate_content(
            model=model_name, 
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"System Overload: The bartender is busy! (Error: {e})"
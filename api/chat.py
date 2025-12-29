import os
from dotenv import load_dotenv
import data 

# --- SETUP ---
load_dotenv()
# We use OPENAI_API_KEY now. Make sure to add this to Vercel!
API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI Client safely
client = None
try:
    from openai import OpenAI
    if API_KEY:
        client = OpenAI(api_key=API_KEY)
except Exception as e:
    print(f"⚠️ OpenAI Import Error: {e}")

# Using the requested model
model_name = 'gpt-5-mini' 

# --- DATA PREPARATION (Same as before) ---
def format_menu():
    """Converts the python lists into a readable text menu for the AI."""
    menu_text = ""
    
    def add_category(name, items):
        nonlocal menu_text
        menu_text += f"\n--- {name.upper()} ---\n"
        # Handle cases where items might be missing keys
        safe_items = items if isinstance(items, list) else []
        for item in safe_items:
            try:
                price = str(item.get('price', 'N/A')).replace(',', '').strip()
            except:
                price = "N/A"
            menu_text += f"- {item.get('name', 'Unknown')} | Price: ₹{price} | Vol: {item.get('volume', 'N/A')}\n"

    # Safely access lists from data.py
    add_category("Beer", getattr(data, 'beers', []))
    add_category("Vodka", getattr(data, 'vodka', []))
    add_category("Rum", getattr(data, 'rum', []))
    add_category("Whisky", getattr(data, 'whisky', []))
    
    return menu_text

# Pre-load the menu context
FULL_MENU_CONTEXT = format_menu()

# --- CHATBOT FUNCTION ---
def chatbot(user_query):
    # 1. Check if Client is working
    if not client:
        return "⚠️ System Error: OpenAI Client failed to start. Check OPENAI_API_KEY in Vercel settings."
    
    # 2. Construct the System Prompt
    system_instruction = f"""
    You are the "ApnaTheka AI Bartender". 
    You have access to the COMPLETE inventory list below.

    INVENTORY:
    {FULL_MENU_CONTEXT}

    INSTRUCTIONS:
    1. Identify the user's budget and vibe from their request.
    2. STRICTLY select items from the INVENTORY where Total Cost <= Budget.
    3. Do the math explicitly (e.g., "1 Whisky (3000) + 4 Beers (250 each) = 4000").
    4. If the exact drink isn't there, suggest a similar one from the INVENTORY.
    5. Keep it short, fun, and use bullet points.
    """

    try:
        # 3. Call OpenAI API
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_query}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"System Overload: The bartender is busy! (Error: {e})"
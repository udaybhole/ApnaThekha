import os
from dotenv import load_dotenv
from google import genai
import data  # Imports your data.py lists

# --- SETUP ---
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("❌ GEMINI_API_KEY missing in .env")

# Initialize Gemini Client
try:
    client = genai.Client(api_key=API_KEY)
    # Using 'gemini-1.5-flash' or 'gemini-2.0-flash' as they have huge context windows
    # perfect for reading your entire menu at once.
    model_name = 'gemini-2.5-flash' 
except Exception as e:
    raise RuntimeError(f"Error initializing Gemini client: {e}")

# --- DATA PREPARATION ---
def format_menu():
    """Converts the python lists into a readable text menu for the AI."""
    menu_text = ""
    
    # Helper to add categories
    def add_category(name, items):
        nonlocal menu_text
        menu_text += f"\n--- {name.upper()} ---\n"
        for item in items:
            # Clean price string (remove commas if any) to help AI with math
            try:
                price = str(item['price']).replace(',', '').strip()
            except:
                price = "N/A"
            menu_text += f"- {item['name']} | Price: ₹{price} | Vol: {item['volume']}\n"

    add_category("Beer", data.beers)
    add_category("Vodka", data.vodka)
    add_category("Rum", data.rum)
    add_category("Whisky", data.whisky)
    
    return menu_text

# Pre-load the menu string so we don't rebuild it every request
FULL_MENU_CONTEXT = format_menu()

# --- CHATBOT FUNCTION ---
def chatbot(user_query):
    prompt = f"""
    You are the "ApnaTheka AI Bartender". 
    You have access to the COMPLETE current inventory list below.

    INVENTORY & PRICES:
    {FULL_MENU_CONTEXT}

    USER REQUEST: "{user_query}"

    YOUR INSTRUCTIONS:
    1. **Identify the Budget:** Look for numbers like "5k", "5000", "2 grand". If no budget is given, assume a standard budget (approx ₹3000) or ask for one.
    2. **Filter by Cost:** strictly select items where the Total Cost <= User Budget. 
       - If they want "Whisky and Beer" for ₹5000, do the math: "1 Whisky (₹3000) + 4 Beers (₹250 each) = ₹4000".
    3. **Match the Vibe:** - "Party" -> Suggest Vodka/Tequila/Beers.
       - "Chill/Classy" -> Suggest Single Malts or Premium Rum.
       - "Get drunk fast" -> Suggest Strong Beers or High alcohol rums.
    4. **Output Format:**
       - Start with a fun, bartender-style greeting.
       - List the selected items clearly with their prices.
       - Show the **Total Estimated Cost**.
       - Explain *why* you picked these (e.g., "This vodka is super smooth for shots").
    
    CONSTRAINTS:
    - Do NOT recommend items not in the list.
    - Do NOT halluncinate prices. Use the exact prices from the INVENTORY.
    - If the budget is too low for their request (e.g., "Blue Label for 1000 rupees"), politely tell them it's not possible and suggest a cheaper alternative (e.g., "Red Label").
    """

    try:
        response = client.models.generate_content(
            model=model_name, 
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"System Overload: The bartender is calculating too many bills! (Error: {e})"

if __name__ == "__main__":
    # Test 1: Specific budget
    print("--- Test 1 ---")
    print(chatbot("I have 4000 rupees, suggest 1 whiskey and some beers for 3 people"))
    
    # Test 2: Vibe based
    print("\n--- Test 2 ---")
    print(chatbot("We want to party hard, budget is 2k"))
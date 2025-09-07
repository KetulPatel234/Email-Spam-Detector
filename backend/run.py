import os
import sys
from app import create_app
from dotenv import load_dotenv
from waitress import serve

# Handle PyInstaller bundle path
if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.dirname(os.path.abspath(__file__))

# Load .env file from the bundle
env_path = os.path.join(base_path, '.env')
load_dotenv(env_path)

# Define model path (relative to base_path)
model_path = os.path.join(base_path, 'app', 'model.pkl')

# Create the app (pass model_path)
app = create_app(model_path=model_path)
app.static_folder = os.path.join(base_path, 'static')

if __name__ == "__main__":
    print("Server starting on http://127.0.0.1:5000...")
    print("Please open your browser and navigate to http://localhost:5000 to access the application.")
    serve(app, host="127.0.0.1", port=5000)
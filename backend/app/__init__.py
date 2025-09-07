from flask import Flask, redirect, url_for, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import joblib

def create_app(model_path=None):
    
    load_dotenv()
    
    app = Flask(__name__, static_folder='static')

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # Adjust origins in production

    # Register blueprints
    from .routes.mails import mails_bp
    app.register_blueprint(mails_bp, url_prefix="/api/mails")
    

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    from .utils import spam_checker
    spam_checker.run()

    return app

from flask import Flask, redirect, url_for
from flask_cors import CORS
from .routes.mails import mails_bp
from dotenv import load_dotenv
import os

def create_app(config_name="development"):
    
    load_dotenv()
    
    app = Flask(__name__)

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # Adjust origins in production

    # Register blueprints
    app.register_blueprint(mails_bp, url_prefix="/api/mails")
    
    from .utils import spam_checker
    spam_checker.run()

    return app

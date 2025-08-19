from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["email_spam_db"]

# Register blueprints
from routes.auth import auth_bp
from routes.mails import mails_bp
from routes.dashboard import dashboard_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(mails_bp, url_prefix="/api/mails")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

if __name__ == "__main__":
    app.run(debug=True)

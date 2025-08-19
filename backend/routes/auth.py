from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from db import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = db.users.find_one({"email": data["email"]})
    if user and check_password_hash(user["password"], data["password"]):
        # In production, use JWT or session
        return jsonify({"success": True, "user": {"email": user["email"]}})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

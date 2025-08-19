from flask import Blueprint, jsonify
from db import db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/metadata', methods=['GET'])
def metadata():
    total_mails = db.mails.count_documents({})
    spam_mails = db.mails.count_documents({"is_spam": True})
    users = db.users.count_documents({})
    return jsonify({
        "total_mails": total_mails,
        "spam_mails": spam_mails,
        "users": users
    })

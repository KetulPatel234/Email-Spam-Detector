from flask import Blueprint, request, jsonify
from db import db

mails_bp = Blueprint('mails', __name__)

@mails_bp.route('/spam', methods=['GET'])
def get_spam_mails():
    # Filters: sender, subject, date, etc.
    filters = {"is_spam": True}
    sender = request.args.get("sender")
    if sender:
        filters["sender"] = sender
    mails = list(db.mails.find(filters, {"_id": 0}))
    return jsonify(mails)

@mails_bp.route('/undo_spam', methods=['POST'])
def undo_spam():
    mail_id = request.json.get("mail_id")
    db.mails.update_one({"mail_id": mail_id}, {"$set": {"is_spam": False}})
    return jsonify({"success": True})

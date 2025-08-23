from flask import Blueprint, request, jsonify
from ..utils import db

mails_bp = Blueprint('mails', __name__)

@mails_bp.route('/undo', methods=['PUT'])
def undo_spam():
    mail_id = request.json.get("mail_id")
    db.mails.update_one({"_id": mail_id}, {"$set": {"is_spam": False}})
    return jsonify({"success": True})
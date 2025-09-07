from flask import Blueprint, request, jsonify
from ..utils import db, undo_spam_mail_by_subject_and_date

mails_bp = Blueprint('mails', __name__)

emails_collection = db["mails"]

@mails_bp.route('/', methods=['GET'])
def get_mails():
    data = emails_collection.find()
    data = list(data)
    return jsonify({"success": True, "data":data})

@mails_bp.route('/undo', methods=['PUT'])
def undo_spam():
    subject = request.json.get("subject")
    date = request.json.get("date")
    mail_id = request.json.get("mail_id")
    emails_collection.update_one({"_id": mail_id}, {"$set": {"is_spam": False, "is_undone": True}})
    undo_spam_mail_by_subject_and_date(subject, date)
    return jsonify({"success": True})
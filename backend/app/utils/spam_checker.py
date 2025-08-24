from email.header import decode_header
from .db import db
import imaplib
import email
import time
import os
import sys
import joblib
import logging
import hashlib
import threading
import app

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Environment variables
IMAP_SERVER = os.getenv("IMAP_SERVER")
IMAP_PORT = os.getenv("IMAP_PORT")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
PASSWORD = os.getenv("EMAIL_PASSWORD")

if not all([IMAP_SERVER, IMAP_PORT, EMAIL_ADDRESS, PASSWORD]):
    raise ValueError("One or more required environment variables are not set.")

IMAP_PORT = int(IMAP_PORT)


if getattr(sys, 'frozen', False):
    # When running as a bundled executable
    base_path = sys._MEIPASS
    model_path = os.path.join(base_path, 'app', 'model.pkl')
else:
    # When running in development
    base_path = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_path, '..', 'model.pkl')

model_path = os.path.abspath(model_path)

# Load the model using the constructed path
spam_classifier = joblib.load(model_path)

emails_collection = db["mails"]

def is_spam(email_subject, email_body):
    """
    Checks if an email is spam using the trained model.
    A simple check for demonstration purposes.
    """
    text = f"{email_subject} {email_body}"
    try:
        prediction = spam_classifier.predict([text])
        return bool(prediction)
    except Exception as e:
        logging.error(f"Spam classification failed: {e}")
        return False

# --- IMAP Functions ---
def connect_to_imap():
    """Establishes an SSL connection to the IMAP server."""
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(EMAIL_ADDRESS, PASSWORD)
        logging.info("Connected to IMAP server successfully.")
        return mail
    except Exception as e:
        logging.error(f"Failed to connect or log in to IMAP server: {e}")
        return None

def decode_subject(subject):
    """Decodes a bytes-like email subject into a string."""
    try:
        decoded_part = decode_header(subject)[0][0]
        if isinstance(decoded_part, bytes):
            return decoded_part.decode()
        return str(decoded_part) or "No Subject"
    except Exception as e:
        logging.warning(f"Could not decode subject: {e}")
        return "No Subject"

def process_spam(mail_conn, email_id, subject):
    """Moves an email to the Gmail Spam folder."""
    try:
        mail_conn.copy(email_id, "[Gmail]/Spam")
        # mail_conn.store(email_id, "+FLAGS", "\\Deleted")
        logging.info(f"Moved to Spam: {subject}")
    except Exception as e:
        logging.error(f"Failed to move email to spam folder: {e}")

def process_emails():
    """Main function to fetch, process, and store emails."""
    mail = connect_to_imap()
    if not mail:
        return

    try:
        mail.select("INBOX")
        _, message_numbers_bytes = mail.search(None, "UNSEEN")
        message_numbers = message_numbers_bytes[0].split()
        
        logging.info(f"Found {len(message_numbers)} unread emails to process.")

        for num in message_numbers:
            # Generate a unique hash for the email
            num_string = num.decode('utf-8')
            # Check if email is already in the database
            if emails_collection.find_one({"_id": num_string}):
                # logging.info(f"Email with ID {num_string[:8]} already in DB. Skipping.")
                continue

            try:
                # Fetch email
                _, msg_data = mail.fetch(num, "(RFC822)")
                email_message = email.message_from_bytes(msg_data[0][1])

                # Get subject and body
                subject = decode_subject(email_message["Subject"])
                print("*"*20)
                print(subject)
                print("*"*20)
                mail_date = email_message["Date"]
                sender = email_message["From"]

                body = ""
                if email_message.is_multipart():
                    for part in email_message.walk():
                        if part.get_content_type() == "text/plain":
                            body = part.get_payload(decode=True).decode(errors='ignore')
                            break
                else:
                    body = email_message.get_payload(decode=True).decode(errors='ignore')
                
                # Check for spam and process
                if is_spam(subject, body):
                    process_spam(mail, num, subject)
                    # Insert email into DB after processing
                    email_doc = {
                        "_id": num_string,
                        "subject": subject,
                        "body": body,
                        "sender": sender,
                        "is_spam": True,
                        "is_undone": False,
                        "mail_date": mail_date,
                        "processed_at": time.time()
                    }
                else:
                    logging.info(f"Processed email: {subject}")
                    # Insert email into DB
                    email_doc = {
                        "_id": num_string,
                        "subject": subject,
                        "body": body,
                        "sender": sender,
                        "is_spam": False,
                        "is_undone": False,
                        "mail_date": mail_date,
                        "processed_at": time.time()
                    }

                mail.store(num, "-FLAGS", "\\Seen")
                emails_collection.insert_one(email_doc)
            
            except Exception as e:
                logging.error(f"Error processing email {num.decode()}: {e}")

    except Exception as e:
        logging.error(f"Error during main email processing loop: {e}")

    finally:
        mail.close()
        mail.logout()
        logging.info("IMAP connection closed.")
        logging.info("-"*50)

def check_for_new_emails_thread():
    """
    Function to run in a separate thread, periodically checking for new emails.
    """
    while True:
        try:
            logging.info("-"*50)
            logging.info("Checking for new emails...")
            process_emails()
        except Exception as e:
            logging.error(f"Error in background email check thread: {e}")
        
        # Wait for a set interval before checking again
        time.sleep(30) # Check every 5 minutes (300 seconds)

def run():
    # Start the email checking thread
    email_thread = threading.Thread(target=check_for_new_emails_thread, daemon=True)
    email_thread.start()
        
    # The main thread can continue to run or just wait
    # In a Flask app, this would be where app.run() is called.
    logging.info("Email checker thread started. Main application running...")
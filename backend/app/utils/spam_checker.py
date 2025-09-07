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
import html  # Added for HTML unescaping if needed
from email.utils import parseaddr  # Added for potential sender parsing, but not directly used here

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
    """
    Foolproof decoding of email subject. Handles multiple encoded parts, None values,
    unknown charsets, and falls back to replacements for undecodable content.
    """
    if subject is None:
        return "No Subject"
    
    try:
        decoded_parts = decode_header(subject)
        result = []
        for decoded_string, charset in decoded_parts:
            if isinstance(decoded_string, bytes):
                # Try the provided charset, fall back to utf-8 or ascii
                if charset is None:
                    charsets_to_try = ['utf-8', 'iso-8859-1', 'windows-1252', 'ascii']
                else:
                    charsets_to_try = [charset, 'utf-8', 'iso-8859-1', 'windows-1252']
                
                decoded = None
                for cs in charsets_to_try:
                    try:
                        decoded = decoded_string.decode(cs, errors='strict')
                        break
                    except (UnicodeDecodeError, LookupError):
                        continue
                
                if decoded is None:
                    # Ultimate fallback: replace invalid chars
                    decoded = decoded_string.decode('utf-8', errors='replace')
                
                result.append(decoded)
            else:
                # Already a string
                result.append(str(decoded_string))
        
        return ' '.join(result).strip() or "No Subject"
    
    except Exception as e:
        logging.warning(f"Could not decode subject (fallback to raw str): {e}")
        # Ultimate fallback: convert to str with replacements
        try:
            return str(subject, errors='replace') or "No Subject"
        except TypeError:
            return "No Subject"

def get_email_body(email_message):
    """
    Foolproof extraction of email body. Handles multipart and single-part emails,
    prefers text/plain, falls back to text/html (with tag stripping), handles
    decoding errors, and collects content from all relevant parts if needed.
    """
    body_parts = []
    
    def extract_text(part):
        """Helper to extract and decode text from a part."""
        try:
            payload = part.get_payload(decode=True)
            if payload is None:
                return ""
            
            charset = part.get_content_charset() or 'utf-8'
            charsets_to_try = [charset, 'utf-8', 'iso-8859-1', 'windows-1252']
            
            text = None
            for cs in charsets_to_try:
                try:
                    text = payload.decode(cs, errors='strict')
                    break
                except (UnicodeDecodeError, LookupError):
                    continue
            
            if text is None:
                text = payload.decode('utf-8', errors='replace')
            
            return text
        except Exception as e:
            logging.warning(f"Failed to extract text from part: {e}")
            return ""

    try:
        if email_message.is_multipart():
            for part in email_message.walk():
                content_type = part.get_content_type().lower()
                if content_type == "text/plain":
                    body_parts.append(extract_text(part))
                elif content_type == "text/html" and not body_parts:  # Fallback if no plain text
                    html_text = extract_text(part)
                    # Simple HTML stripping (can be improved with BeautifulSoup if installed)
                    stripped = html.unescape(html_text).replace('<', ' ').replace('>', ' ').strip()
                    body_parts.append(' '.join(stripped.split()))
        else:
            # Single part email
            body_parts.append(extract_text(email_message))
        
        # Join all collected parts, remove excessive whitespace
        body = ' '.join(body_parts).strip()
        return body if body else "No Body Content"
    
    except Exception as e:
        logging.error(f"Failed to get email body: {e}")
        return "No Body Content"

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
            num_string = num.decode('utf-8')
            # Check if email is already in the database
            if emails_collection.find_one({"_id": num_string}):
                logging.info(f"Email with ID {num_string[:8]} already in DB. Skipping.")
                continue

            try:
                # Fetch email with robust error handling
                _, msg_data = mail.fetch(num, "(RFC822)")
                if not msg_data or not msg_data[0] or len(msg_data[0]) < 2 or msg_data[0][1] is None:
                    logging.error(f"Invalid or empty email data for ID {num_string}. Skipping.")
                    continue

                try:
                    email_message = email.message_from_bytes(msg_data[0][1])
                except Exception as e:
                    logging.error(f"Failed to parse email message for ID {num_string}: {e}")
                    continue

                # Get subject and body using foolproof methods
                subject = decode_subject(email_message.get("Subject"))
                mail_date = email_message.get("Date") or "No Date"
                sender = email_message.get("From") or "Unknown Sender"

                body = get_email_body(email_message)
                
                # Check for spam and process
                if is_spam(subject, body):
                    process_spam(mail, num, subject)
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
                logging.error(f"Error processing email {num_string}: {e}")
                continue  # Skip to next email on error

    except Exception as e:
        logging.error(f"Error during main email processing loop: {e}")

    finally:
        try:
            mail.close()
            mail.logout()
            logging.info("IMAP connection closed.")
        except Exception as e:
            logging.error(f"Error closing IMAP connection: {e}")
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
        time.sleep(30) # Check every 30 seconds for testing; adjust to 300 for 5 minutes

def run():
    # Start the email checking thread
    email_thread = threading.Thread(target=check_for_new_emails_thread, daemon=True)
    email_thread.start()
        
    # The main thread can continue to run or just wait
    # In a Flask app, this would be where app.run() is called.
    logging.info("Email checker thread started. Main application running...")
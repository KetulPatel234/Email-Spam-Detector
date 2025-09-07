import imaplib
import os

# Environment variables
IMAP_SERVER = os.getenv("IMAP_SERVER")
IMAP_PORT = os.getenv("IMAP_PORT")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
PASSWORD = os.getenv("EMAIL_PASSWORD")

if not all([IMAP_SERVER, IMAP_PORT, EMAIL_ADDRESS, PASSWORD]):
    raise ValueError("One or more required environment variables are not set.")

IMAP_PORT = int(IMAP_PORT)


# --- IMAP Functions ---
def connect_to_imap():
    """Establishes an SSL connection to the IMAP server."""
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(EMAIL_ADDRESS, PASSWORD)
        return mail
    except Exception as e:
        return None

def undo_spam_mail_by_subject_and_date(subject, date_str):
    """
    Finds an email in the Spam folder by subject and date, then moves it to the Inbox.
    Args:
        subject (str): The subject line of the email to find.
        date_str (str): The date the email was received, in the format "DD-Mon-YYYY" (e.g., "25-Aug-2025").
    """
    mail = connect_to_imap()
    if mail is None:
        raise ConnectionError("Could not connect to IMAP server.")

    try:
        # Select the Spam folder to find the email
        status, messages = mail.select("[Gmail]/Spam")
        if status != "OK":
            raise ValueError("Could not select Spam folder.")

        # Search for the email using both subject and date

        date_parts = date_str.split(", ")[1].split(" ")[0:3]
        date_str = "-".join([date_parts[0], date_parts[1], date_parts[2]])
        search_criteria = f'(SUBJECT "{subject}") (SINCE "{date_str}")'
        status, msg_numbers = mail.search(None, search_criteria)
        if status != "OK" or not msg_numbers[0]:
            print(f"No email found with subject '{subject}' received since {date_str}.")
            return

        # Get the first message ID found
        mail_id = msg_numbers[0].split()[0].decode('utf-8')
        
        # Copy the email to the INBOX
        mail.copy(mail_id, 'INBOX')
        
        # Mark the original email in the Spam folder for deletion
        mail.store(mail_id, '+FLAGS', '\\Deleted')
        
        # Permanently delete messages marked as \Deleted
        mail.expunge()

        print(f"Successfully moved email with subject '{subject}' and date '{date_str}' from Spam to INBOX.")

    except Exception as e:
        print(f"Failed to undo spam: {e}")
    finally:
        if mail:
            mail.logout()

import imaplib
import email
from email.header import decode_header
import schedule
import time
import os

IMAP_SERVER = os.getenv("IMAP_SERVER")
IMAP_PORT = int(os.getenv("IMAP_PORT"))
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
PASSWORD = os.getenv("EMAIL_PASSWORD")

# Simple AI-based spam detection (keyword-based for demo)
def is_spam(email_subject, email_body):
    spam_keywords = ["win", "free", "lottery", "urgent", "money", "viagra", "offer"]
    content = f"{email_subject} {email_body}".lower()
    return any(keyword in content for keyword in spam_keywords)

# Decode email subject
def decode_subject(subject):
    decoded = decode_header(subject)[0][0]
    if isinstance(decoded, bytes):
        return decoded.decode()
    return decoded or "No Subject"

# Connect to Gmail and process emails
def check_emails():
    try:
        # Connect to IMAP server
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(EMAIL_ADDRESS, PASSWORD)
        mail.select("INBOX")

        # Search for unread emails
        _, message_numbers = mail.search(None, "UNSEEN")
        for num in message_numbers[0].split():
            # Fetch email
            _, msg_data = mail.fetch(num, "(RFC822)")
            email_message = email.message_from_bytes(msg_data[0][1])

            # Get subject
            subject = decode_subject(email_message["Subject"])

            # Get email body
            body = ""
            if email_message.is_multipart():
                for part in email_message.walk():
                    if part.get_content_type() == "text/plain":
                        body = part.get_payload(decode=True).decode()
                        break
            else:
                body = email_message.get_payload(decode=True).decode()
            print(f"Processing email: {subject}")
            # Check if email is spam
            # if is_spam(subject, body):
            #     # Move to Junk/Spam folder
            #     mail.copy(num, "[Gmail]/Spam")
            #     mail.store(num, "+FLAGS", "\\Deleted")
            #     print(f"Moved to Spam: {subject}")
            # else:
            #     # Mark as unread (ensure it remains unread)
            #     mail.store(num, "-FLAGS", "\\Seen")
            #     print(f"Kept as Unread: {subject}")

        # Expunge deleted emails and logout
        mail.expunge()
        mail.logout()

    except Exception as e:
        print(f"Error: {e}")

# Schedule the email check every 1 minute
schedule.every(0.1).minutes.do(check_emails)

# Run the scheduler
print("Starting email checker...")
while True:
    schedule.run_pending()
    # time.sleep(1)
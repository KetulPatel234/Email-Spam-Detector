# Import Libraries
import pandas as pd

# Library used for data preprocessing
from sklearn.feature_extraction.text import CountVectorizer

# Import model selection libraries
from sklearn.model_selection import train_test_split

# Library used for ML Model implementation
from sklearn.naive_bayes import MultinomialNB

# Importing the Pipeline class from scikit-learn
from sklearn.pipeline import Pipeline

# Library used for saving the model
import joblib

df = pd.read_csv("../data/spam.csv", encoding='ISO-8859-1')

df.dropna(inplace=True)

print("\nMissing values after cleaning:")
print(df.isnull().sum())

X_train,X_test,y_train,y_test=train_test_split(df.Message,df.Spam,test_size=0.25)

clf = Pipeline([
    ('vectorizer', CountVectorizer()),  # Step 1: Text data transformation
    ('nb', MultinomialNB())  # Step 2: Classification using Naive Bayes
])

clf.fit(X_train, y_train)

# Calculate accuracy on the test set
accuracy = clf.score(X_test, y_test)
print(f"Test Set Accuracy: {accuracy * 100:.2f}%")

def detect_spam(email_text):
    prediction = clf.predict([email_text])

    if prediction == 0:
        return "ham"
    else:
        return "spam"

test_emails = [
    { "mail": "Claim your $500 Amazon voucher now! Limited time offer!", "output": "spam" },
    { "mail": "Hi Mark, can you review the budget proposal by tomorrow?", "output": "ham" },
    { "mail": "Win a luxury cruise vacation! Enter now for free!", "output": "spam" },
    { "mail": "Your subscription to Cloud Storage expires tomorrow. Renew now.", "output": "ham" },
    { "mail": "Unlock exclusive discounts on our premium courses! Sign up today!", "output": "spam" },
    { "mail": "Hey Anna, are you free for coffee this afternoon?", "output": "ham" },
    { "mail": "Get rich quick with our proven investment strategy!", "output": "spam" },
    { "mail": "Reminder: Parent-teacher meeting is scheduled for Thursday at 4 PM.", "output": "ham" },
    { "mail": "Your PayPal account needs urgent verification. Click to secure now.", "output": "spam" },
    { "mail": "Hi team, let’s finalize the presentation slides by EOD.", "output": "ham" },
    { "mail": "Free trial for our premium VPN service! Sign up now!", "output": "spam" },
    { "mail": "John, can you send me the updated project roadmap?", "output": "ham" },
    { "mail": "Exclusive offer: 70% off all electronics this week only!", "output": "spam" },
    { "mail": "Your library books are due this Friday. Please return them on time.", "output": "ham" },
    { "mail": "Earn $2000 monthly with our affiliate program! Join now!", "output": "spam" },
    { "mail": "Hi Emily, can we reschedule our meeting to next Monday?", "output": "ham" },
    { "mail": "Win a free MacBook Pro! Click to enter the giveaway!", "output": "spam" },
    { "mail": "Your gym membership payment is due by the end of the month.", "output": "ham" },
    { "mail": "Limited time: Get 50% off your first order with us!", "output": "spam" },
    { "mail": "Hey Mike, thanks for the feedback. Can we discuss it tomorrow?", "output": "ham" },
    { "mail": "Your account has been flagged. Verify your identity now!", "output": "spam" },
    { "mail": "Team, please join the Zoom call at 2 PM for the project update.", "output": "ham" },
    { "mail": "Get a free smartwatch with your subscription! Act now!", "output": "spam" },
    { "mail": "Hi Rachel, can you confirm your availability for the workshop?", "output": "ham" },
    { "mail": "Flash sale: Buy now and save big on all products!", "output": "spam" },
    { "mail": "Your package is out for delivery and will arrive by 5 PM.", "output": "ham" },
    { "mail": "Join our crypto trading platform and earn millions!", "output": "spam" },
    { "mail": "Hi David, let’s grab lunch this Friday to catch up.", "output": "ham" },
    { "mail": "Your credit card has been charged. Click to dispute now!", "output": "spam" },
    { "mail": "Reminder: Your car service appointment is tomorrow at 9 AM.", "output": "ham" },
    { "mail": "Exclusive deal: Free shipping on all orders this weekend!", "output": "spam" },
    { "mail": "Hi Lisa, can you share the meeting notes from yesterday?", "output": "ham" },
    { "mail": "Win a $2000 travel voucher! Click to claim now!", "output": "spam" },
    { "mail": "Your utility bill is due by next Wednesday.", "output": "ham" },
    { "mail": "Start your own business with our $99 starter kit!", "output": "spam" },
    { "mail": "Hey Tom, can you join the team call at 11 AM tomorrow?", "output": "ham" },
    { "mail": "Your Netflix account needs verification. Click to update now!", "output": "spam" },
    { "mail": "Hi Sophie, let’s review the contract draft this afternoon.", "output": "ham" },
    { "mail": "Get a free trial of our premium software! Sign up today!", "output": "spam" },
    { "mail": "Your flight confirmation for next week has been sent.", "output": "ham" },
    { "mail": "Earn cash rewards with every purchase! Join now!", "output": "spam" },
    { "mail": "Hi Alex, can you send the client proposal by tomorrow?", "output": "ham" },
    { "mail": "Limited offer: 80% off all fashion items this week!", "output": "spam" },
    { "mail": "Your medical appointment is confirmed for Monday at 2 PM.", "output": "ham" },
    { "mail": "Click to claim your free $100 gift card now!", "output": "spam" },
    { "mail": "Hi Jane, thanks for the update. Can we discuss it tomorrow?", "output": "ham" },
    { "mail": "Join our exclusive webinar and learn to make millions!", "output": "spam" },
    { "mail": "Your order has been shipped and will arrive by Friday.", "output": "ham" },
    { "mail": "Get a free vacation package! Sign up now!", "output": "spam" },
    { "mail": "Hi Chris, can you confirm the meeting time for next week?", "output": "ham" }
]

correct_predictions = 0
for i, email in enumerate(test_emails, 1):
    result = detect_spam(email['mail'])
    if result == email['output']:
        correct_predictions += 1

print(f"Correct Predictions: {correct_predictions} out of {len(test_emails)}")

# Save the model to a file
joblib.dump(clf, 'model1.pkl')
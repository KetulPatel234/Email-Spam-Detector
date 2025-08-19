import joblib

model = joblib.load("model/spam_model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")

def is_spam(email_text):
    features = vectorizer.transform([email_text])
    return bool(model.predict(features)[0])

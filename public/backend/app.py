from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv
from groq import Groq

# ---- Load environment variables ----
load_dotenv()

# ---- Configure Groq ----
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
groq_client = None
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
    print("✅ Groq API configured successfully")
else:
    print("⚠️  GROQ_API_KEY not found in .env")

app = Flask(__name__)
CORS(app)

# ---- Load & train ML model ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
data = pd.read_csv(os.path.join(BASE_DIR, "Training.csv"))
df = pd.DataFrame(data)
feature_cols = df.columns[:-1]
X = df[feature_cols]
y = df['prognosis']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)
dt = DecisionTreeClassifier()
dt.fit(X_train, y_train)
print("Model trained. Accuracy:", dt.score(X_test, y_test))

symptoms = list(feature_cols)
dictionary = {s: i for i, s in enumerate(symptoms)}

def predict_from_symptoms(symptom_list):
    n = len(symptoms)
    input_vec = np.zeros(n, dtype=int)
    for s in symptom_list:
        if s in dictionary:
            input_vec[dictionary[s]] = 1
    input_vec = input_vec.reshape(1, -1)
    pred = dt.predict(input_vec)[0]
    confidence = 0.0
    if hasattr(dt, "predict_proba"):
        probs = dt.predict_proba(input_vec)
        try:
            class_idx = list(dt.classes_).index(pred)
            confidence = float(probs[0][class_idx]) * 100.0
        except Exception:
            confidence = float(np.max(probs)) * 100.0
    else:
        confidence = 90.0
    return {
        "disease": str(pred),
        "confidence": round(confidence, 2),
        "description": "Predicted by local DecisionTree model trained on provided data.",
        "recommendations": "This is an automated prediction. Consult a healthcare professional for diagnosis."
    }

@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(force=True)
    symptom_list = payload.get("symptoms", [])
    if not isinstance(symptom_list, list):
        return jsonify({"error": "symptoms must be a list"}), 400
    result = predict_from_symptoms(symptom_list)
    return jsonify(result)

@app.route("/chatbot", methods=["POST"])
def chatbot():
    if not groq_client:
        return jsonify({"error": "GROQ_API_KEY not configured in .env file"}), 500

    payload = request.get_json(force=True)
    symptom_list = payload.get("symptoms", [])
    location = payload.get("location", "").strip()

    if not isinstance(symptom_list, list) or len(symptom_list) == 0:
        return jsonify({"error": "Please provide at least one symptom"}), 400

    formatted_symptoms = ", ".join(s.replace("_", " ") for s in symptom_list)

    # Build prompt based on whether location is provided
    location_section = ""
    if location:
        location_section = f"""
5. **Nearest Doctors & Clinics in {location}**: Recommend 3-5 best doctors or clinics near {location} for these symptoms. For each provide:
   - Doctor/Clinic name
   - Specialization
   - Area/Address in {location}
   - Why they are recommended
   If you don't have specific data for {location}, suggest the types of specialists to search for on Practo, Google Maps, or local hospital directories in {location}."""

    prompt = f"""You are a helpful healthcare assistant. A patient has these symptoms: {formatted_symptoms}.
{"The patient is located in: " + location + "." if location else ""}

Please provide:
1. **Possible Conditions**: Most likely health conditions for these symptoms
2. **Doctor to See**: What specialist to consult and why
3. **Precautions & Measures**: Do's, Don'ts, diet, lifestyle changes
4. **Home Remedies & Self-Care**: Safe tips to relieve symptoms
{location_section}
6. **Emergency Signs**: When to seek immediate medical care

Be clear, structured with bullet points. Always remind to consult a real doctor."""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful healthcare assistant. Provide structured, actionable advice. Always advise users to consult a real doctor."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=2048,
            temperature=0.7
        )
        return jsonify({
            "symptoms": formatted_symptoms,
            "location": location,
            "recommendation": response.choices[0].message.content
        })

    except Exception as e:
        print(f"Groq API error: {str(e)}")
        return jsonify({"error": f"Failed to get response: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ---- load & train ----
data = pd.read_csv("Training.csv")
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

    # compute confidence if predict_proba available
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

    description = "Predicted by local DecisionTree model trained on provided data."
    recommendations = "This is an automated prediction. Consult a healthcare professional for diagnosis."
    return {
        "disease": str(pred),
        "confidence": round(confidence, 2),
        "description": description,
        "recommendations": recommendations
    }


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(force=True)
    symptom_list = payload.get("symptoms", [])
    if not isinstance(symptom_list, list):
        return jsonify({"error": "symptoms must be a list"}), 400
    result = predict_from_symptoms(symptom_list)
    return jsonify(result)

if __name__ == "__main__":
    # read PORT provided by Render or default to 5000 locally
    port = int(os.environ.get("PORT", 5000))
    # bind to 0.0.0.0 so Render can reach it (not just localhost)
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")

from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/')
def home():
    return "Rating Prediction API is running."

@app.route('/predict-rating', methods=['POST'])
def predict_rating():
    data = request.get_json()
    feedback = data.get("feedback", "")

    if not feedback:
        return jsonify({"error": "Feedback is required"}), 400

    blob = TextBlob(feedback)
    polarity = blob.sentiment.polarity  

    rating = round(((polarity + 1) / 2) * 4 + 1, 1)
    rating = min(max(rating, 1.0), 5.0) 



    return jsonify({
        "feedback": feedback,
        "predicted_rating": rating
    })

if __name__ == '__main__':
    app.run(debug=True)

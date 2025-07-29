# app/main.py

@app.route("/")
def home():
    return "✅ Flashcard backend is online and ready."


from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    project=os.getenv("OPENAI_PROJECT_ID")
)

@app.route("/generate", methods=["POST"])
def generate_flashcards():
    data = request.get_json()
    lecture_text = data.get("text", "")[:4000]  # Limit size
    prompt = f"""
You're a university study coach. Based on the following lecture notes, generate 10 helpful flashcards in Q&A format.

Lecture:
{lecture_text}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return jsonify({"flashcards": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Only used for local testing (not in production)
if __name__ == "__main__":
    app.run(debug=True)









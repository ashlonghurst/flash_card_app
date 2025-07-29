import os
import streamlit as st
import fitz  # PyMuPDF
from openai import OpenAI
from dotenv import load_dotenv

# ✅ Load environment variables from .env
load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    project=os.getenv("OPENAI_PROJECT_ID")
)

# Extract text from uploaded PDF
def extract_text_from_pdf(uploaded_pdf):
    doc = fitz.open(stream=uploaded_pdf.read(), filetype="pdf")
    return "\n".join([page.get_text() for page in doc])

# Generate flashcards using GPT-4o
def generate_flashcards(text):
    prompt = f"""
You're a university study coach. Based on the following lecture notes, generate 10 flashcards in Q&A format.

Lecture:
{text[:4000]}
"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response.choices[0].message.content

# Streamlit UI
st.set_page_config(page_title="AI Flashcard Generator", page_icon="📘")
st.title("🎓 AI Flashcard Generator (GPT-4o)")

uploaded_pdf = st.file_uploader("Upload your lecture notes (PDF)", type="pdf")

if uploaded_pdf:
    text = extract_text_from_pdf(uploaded_pdf)

    if st.button("Generate Flashcards"):
        with st.spinner("Generating flashcards using GPT-4o..."):
            try:
                flashcards = generate_flashcards(text)
                st.text_area("📋 Your Flashcards", flashcards, height=400)
            except Exception as e:
                st.error(f"❌ OpenAI API Error: {e}")







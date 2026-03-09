import google.generativeai as genai
import json
import os

from dotenv import load_dotenv

load_dotenv()


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")


def generate_quiz_questions(domain: str, difficulty: str, count: int):

    prompt = f"""
You are an expert technical interviewer.

Generate {count} multiple choice questions.

Domain: {domain}
Difficulty: {difficulty}

Return ONLY valid JSON.

Format:
[
  {{
    "question": "text",
    "option_a": "text",
    "option_b": "text",
    "option_c": "text",
    "option_d": "text",
    "correct_answer": "A"
  }}
]

Rules:
- correct_answer must be A/B/C/D
- Do not add explanations
- Do not add text outside JSON
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    try:
        questions = json.loads(text)
        return questions
    except Exception:
        return []
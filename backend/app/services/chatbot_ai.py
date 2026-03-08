from __future__ import annotations

from datetime import datetime
import logging
from typing import List, Dict, Any

import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_

from app.core.config import settings
from app.models.chatbot_log import ChatbotLog
from app.models.student_profiles import StudentProfile
from app.models.quiz_result import QuizResult
from app.models.quiz import Quiz

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)


def _create_gemini_model() -> genai.GenerativeModel:
    """Pick the best available model for the current API key."""

    # ✅ UPDATED MODEL LIST
    preferred = [
        "models/gemini-2.5-flash",        # Stable 2.5
        "models/gemini-2.0-flash",        # Stable 2.0 (until June 2026)
        "models/gemini-3-flash-preview",  # Newest Gemini 3
        "models/gemini-1.5-flash",        # Reliable fallback
    ]

    try:
        available = {
            getattr(m, "name", "")
            for m in genai.list_models()
            if "generateContent" in getattr(m, "supported_generation_methods", [])
        }
    except Exception as exc:
        logger.warning("Could not list Gemini models, using fallback: %s", exc)
        available = set()

    for model_name in preferred:
        if not available or model_name in available:
            logger.info("Using Gemini model: %s", model_name)
            return genai.GenerativeModel(model_name)

    # Last resort when model listing succeeds but preferred names are missing.
    fallback = sorted(available)[0]
    logger.info("Using fallback Gemini model: %s", fallback)
    return genai.GenerativeModel(fallback)


model = _create_gemini_model()


BASE_SYSTEM_PROMPT = """
You are PlacementCoach AI, an expert career and placement training assistant for college students in India.

Your primary purpose is to help students prepare for campus placements by providing guidance on:

📚 **Core Topics:**
- Aptitude preparation (quantitative, logical reasoning, verbal ability)
- Technical interview concepts (programming, data structures, algorithms, DBMS, OS, networks)
- HR interview practice and preparation
- Resume building and optimization tips
- Company-specific preparation strategies (TCS, Infosys, Wipro, Cognizant, etc.)
- Coding practice and problem-solving techniques
- Mock interview tips and feedback
- Soft skills for interviews (communication, confidence building)

⚠️ **Important Guidelines:**
1. Keep answers concise, practical, and actionable
2. Use bullet points for clarity when listing items
3. Ask follow-up questions to understand student needs better
4. If asked about non-placement topics, politely redirect to placement preparation
5. Focus on Indian campus recruitment context and companies
6. Be encouraging and motivational while being honest about preparation requirements

❌ **Out of Scope:** If asked about topics unrelated to placement training (politics, entertainment, personal advice unrelated to career), respond:
"I'm specialized in placement training and career preparation. Let's focus on helping you ace your campus placements! How can I assist with your interview prep, aptitude, technical skills, or resume?"

Remember: Your goal is to help students succeed in their placement journey!
""".strip()


# ---------------- STUDENT CONTEXT ---------------- #

def get_student_context(db: Session, user_id: int) -> Dict[str, Any]:

    try:
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == user_id
        ).first()

        if not student_profile:
            logger.info(f"No student profile found for user {user_id}")
            return {"error": "No profile found"}

        quiz_results = db.query(QuizResult, Quiz.topic, Quiz.exam_type, Quiz.company).join(
            Quiz, QuizResult.quiz_id == Quiz.id
        ).filter(
            QuizResult.user_id == user_id
        ).order_by(desc(QuizResult.submitted_at)).limit(10).all()

        if not quiz_results:
            return {
                "profile": {
                    "branch": student_profile.branch,
                    "college": student_profile.college,
                    "current_year": student_profile.current_year,
                    "cgpa": student_profile.cgpa,
                    "skills": student_profile.skills or []
                },
                "performance": {
                    "overall_avg": 0,
                    "total_attempts": 0,
                    "topic_averages": {},
                    "type_averages": {},
                    "weak_topics": [],
                    "weak_exam_types": [],
                    "recent_scores": []
                }
            }

        performance_by_topic = {}
        performance_by_type = {}

        for result, topic, exam_type, company in quiz_results:

            if topic not in performance_by_topic:
                performance_by_topic[topic] = []
            performance_by_topic[topic].append(result.percentage)

            if exam_type not in performance_by_type:
                performance_by_type[exam_type] = []
            performance_by_type[exam_type].append(result.percentage)

        topic_averages = {t: sum(s)/len(s) for t, s in performance_by_topic.items()}
        type_averages = {t: sum(s)/len(s) for t, s in performance_by_type.items()}

        weak_topics = [t for t, a in topic_averages.items() if a < 70]
        weak_types = [t for t, a in type_averages.items() if a < 70]

        all_scores = []
        for scores in performance_by_topic.values():
            all_scores.extend(scores)

        overall_avg = sum(all_scores)/len(all_scores) if all_scores else 0

        return {
            "profile": {
                "branch": student_profile.branch,
                "college": student_profile.college,
                "current_year": student_profile.current_year,
                "cgpa": student_profile.cgpa,
                "skills": student_profile.skills or []
            },
            "performance": {
                "overall_avg": round(overall_avg,2),
                "total_attempts": len(quiz_results),
                "topic_averages": {k: round(v,2) for k,v in topic_averages.items()},
                "type_averages": {k: round(v,2) for k,v in type_averages.items()},
                "weak_topics": weak_topics,
                "weak_exam_types": weak_types,
                "recent_scores": [r.percentage for r,_,_,_ in quiz_results[:5]]
            }
        }

    except Exception as e:
        logger.error(f"Error fetching student context: {e}")
        return {"error": str(e)}


def get_recent_history(db: Session, user_id: int, limit: int = 5):
    """
    Fetch recent chatbot conversation history for the user.
    """
    try:
        rows = (
            db.query(ChatbotLog)
            .order_by(ChatbotLog.id.desc())
            .limit(limit)
            .all()
        )
        return list(reversed(rows))
    except Exception as e:
        logger.error(f"Error fetching chat history: {e}")
        return []


# --------------- CHATBOT RESPONSE ---------------- #

def generate_chatbot_response(db: Session, user_id: int, user_message: str) -> tuple[str, datetime]:

    message = (user_message or "").strip()
    now = datetime.utcnow()

    history = []

    student_context = get_student_context(db, user_id)

    system_prompt = BASE_SYSTEM_PROMPT

    prompt = f"{system_prompt}\n\nStudent: {message}\nPlacementCoach AI:"

    try:
        logger.info("🤖 Sending request to Gemini AI...")

        result = model.generate_content(
            prompt,
            generation_config={"temperature": 0.7}
        )

        reply = ""

        if hasattr(result,"text") and result.text:
            reply = result.text.strip()

        if not reply:
            reply = "I'm here to help with placement preparation."

        return reply, now

    except Exception as exc:

        logger.exception("❌ Chatbot generation failed")

        return (
            "Gemini is temporarily unavailable. Please try again later.",
            now
        )


def save_chat_log(db: Session, user_id: int, query: str, response: str) -> None:

    log = ChatbotLog(query=query, response=response)

    db.add(log)

    db.commit()
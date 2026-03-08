"""
AI Question Generator Service for Bulk Generation
Generates company-specific questions at scale
"""
from typing import List, Dict
from sqlalchemy.orm import Session
from app.core.openai_client import call_openai  # Now uses Gemini internally
from app.models.question import Question
from app.utils.logger import logger
import json


def build_bulk_prompt(
    company: str,
    track: str,
    exam_type: str,
    category: str,
    topic: str,
    difficulty: str,
    count: int
) -> str:
    """Build AI prompt for bulk question generation"""
    return f"""
You are an expert question setter for {company} placement exams with 20+ years experience.

Generate exactly {count} {difficulty}-level multiple-choice questions.

Company: {company}
Track: {track}
Exam Type: {exam_type}
Category: {category}
Topic: {topic}
Difficulty: {difficulty}

CRITICAL RULES:
1. Follow REAL {company} placement exam patterns and difficulty level
2. EXACTLY 4 options per question (A, B, C, D)
3. ONLY ONE correct answer per question
4. Options must be realistic and competitive (not obviously wrong)
5. Provide brief, clear explanations for learning
6. Output ONLY valid JSON array - no markdown, no code blocks
7. For technical: include code examples or technical details when relevant
8. Questions must be diverse and non-repetitive
9. Use real-world scenarios relevant to {company} interview style

JSON format (MUST BE VALID JSON ARRAY):
[
  {{
    "question": "What is the time complexity of binary search?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "correct_answer": "O(log n)",
    "explanation": "Binary search divides the search space in half each iteration"
  }}
]

Generate {count} unique questions now. Output ONLY JSON array:
"""


def generate_questions_batch(
    company: str,
    track: str,
    exam_type: str,
    category: str,
    topic: str,
    difficulty: str,
    count: int,
    db: Session
) -> List[Dict]:
    """
    Generate a batch of questions using AI
    Returns list of question dicts ready for DB insertion
    """
    questions = []
    batch_size = 50  # OpenAI works better with smaller batches
    
    # Generate in batches to avoid token limits
    for i in range(0, count, batch_size):
        current_batch_size = min(batch_size, count - i)
        
        try:
            prompt = build_bulk_prompt(
                company=company,
                track=track,
                exam_type=exam_type,
                category=category,
                topic=topic,
                difficulty=difficulty,
                count=current_batch_size
            )
            
            logger.info(f"Generating batch {i//batch_size + 1}: {current_batch_size} questions for {topic}")
            
            response = call_openai(prompt)
            
            # Parse JSON response
            try:
                batch_questions = json.loads(response)
                
                if not isinstance(batch_questions, list):
                    logger.error(f"AI response is not a list: {type(batch_questions)}")
                    continue
                
                # Validate and format each question
                for q in batch_questions:
                    if validate_question_structure(q):
                        questions.append({
                            "company": company,
                            "track": track,
                            "exam_type": exam_type,
                            "category": category,
                            "topic": topic,
                            "difficulty": difficulty,
                            "question_type": "MCQ",
                            "question": q["question"],
                            "options": q["options"],
                            "correct_answer": q["correct_answer"],
                            "explanation": q.get("explanation", ""),
                            "source": "AI_BULK",
                            "approved": False
                        })
                
                logger.info(f"Successfully generated {len(batch_questions)} questions in batch")
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response as JSON: {e}")
                logger.error(f"Response: {response[:500]}")
                continue
                
        except Exception as e:
            logger.error(f"Error generating batch for {topic}: {str(e)}")
            continue
    
    return questions


def validate_question_structure(q: dict) -> bool:
    """Validate a single question's structure"""
    required_fields = {"question", "options", "correct_answer"}
    
    if not isinstance(q, dict):
        return False
    
    if not required_fields.issubset(q.keys()):
        logger.warning(f"Question missing fields: {required_fields - set(q.keys())}")
        return False
    
    if not isinstance(q.get("options"), list) or len(q.get("options", [])) != 4:
        logger.warning(f"Invalid options: {q.get('options')}")
        return False
    
    if q.get("correct_answer") not in q.get("options", []):
        logger.warning(f"Correct answer not in options: {q.get('correct_answer')}")
        return False
    
    return True


def generate_questions_for_company(
    company: str,
    track: str,
    exam_type: str,
    category: str,
    topics: List[str],
    difficulty: str,
    questions_per_topic: int,
    db: Session
) -> tuple[int, dict]:
    """
    Generate questions for multiple topics in bulk
    Returns: (total_generated, breakdown_dict)
    """
    all_questions = []
    breakdown = {}
    
    for topic in topics:
        logger.info(f"Starting generation for topic: {topic}")
        
        # Check existing questions
        existing_count = db.query(Question).filter(
            Question.company == company,
            Question.track == track,
            Question.exam_type == exam_type,
            Question.category == category,
            Question.topic == topic,
            Question.difficulty == difficulty
        ).count()
        
        logger.info(f"{topic}: {existing_count} existing questions")
        
        # Generate new questions
        topic_questions = generate_questions_batch(
            company=company,
            track=track,
            exam_type=exam_type,
            category=category,
            topic=topic,
            difficulty=difficulty,
            count=questions_per_topic,
            db=db
        )
        
        # Add to database
        for q_data in topic_questions:
            question = Question(**q_data)
            db.add(question)
        
        all_questions.extend(topic_questions)
        breakdown[topic] = len(topic_questions)
        
        logger.info(f"Generated {len(topic_questions)} questions for {topic}")
    
    # Commit all at once
    try:
        db.commit()
        logger.info(f"Successfully committed {len(all_questions)} questions to database")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to commit questions: {str(e)}")
        raise
    
    return len(all_questions), breakdown

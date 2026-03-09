from sqlalchemy.orm import Session
from app.core.openai_client import call_openai  # Now uses Gemini internally
from app.models.quiz import Quiz
from app.models.question import Question
from app.schemas.quiz import AIQuestionRequest, QuizCreateResponse, QuestionView
import json
import logging

logger = logging.getLogger(__name__)


def build_prompt(request: AIQuestionRequest) -> str:
    """Build AI prompt for exam-level questions"""
    return f"""
You are an expert question setter for company placement exams with 20+ years experience.

Generate exactly {request.num_questions} {request.difficulty}-level multiple-choice questions.

Company: {request.company}
Track: {request.track}
Exam Type: {request.exam_type}
Category: {request.category}
Topic: {request.topic}

CRITICAL RULES:
1. Follow REAL {request.company} placement exam patterns and difficulty
2. EXACTLY 4 options per question (A, B, C, D)
3. ONLY ONE correct answer per question
4. Options must be realistic and competitive (not obviously wrong)
5. Provide brief, clear explanations for learning
6. Output ONLY valid JSON array - no markdown, no explanations outside JSON
7. For technical: include code examples or technical details when relevant
8. For aptitude: realistic business/mathematical scenarios

JSON format (MUST BE VALID JSON):
[
  {{
    "question": "What is the output of this code?\\n...code here...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option B",
    "explanation": "Brief explanation why Option B is correct and others are wrong"
  }}
]

Generate {request.num_questions} questions now. Output ONLY JSON array:
"""


def validate_ai_output(questions: list) -> bool:
    """Validate AI JSON structure"""
    if not isinstance(questions, list) or len(questions) == 0:
        return False
    
    required_fields = {"question", "options", "correct_answer"}
    for i, q in enumerate(questions):
        if not isinstance(q, dict):
            logger.warning(f"Question {i} is not a dict")
            return False
        if not required_fields.issubset(q.keys()):
            logger.warning(f"Question {i} missing fields: {required_fields - set(q.keys())}")
            return False
        if not isinstance(q.get("options"), list) or len(q.get("options", [])) != 4:
            logger.warning(f"Question {i} options invalid: {q.get('options')}")
            return False
        if q.get("correct_answer") not in q.get("options", []):
            logger.warning(f"Question {i} correct_answer not in options")
            return False
    
    return True


def get_fallback_questions(topic: str, difficulty: str, count: int) -> list:
    """Seed data: Real curated questions (not fake)"""
    fallback_bank = {
        "Arrays": [
            {
                "question": "What is the time complexity of accessing an element in an array by index?",
                "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
                "correct_answer": "O(1)",
                "explanation": "Array indexing is constant time regardless of array size due to direct memory addressing."
            },
            {
                "question": "Which of these is NOT a valid way to declare an array in Java?",
                "options": ["int[] arr = new int[5];", "int arr[] = new int[5];", "int[] arr = {1,2,3};", "int[] arr = new int[];"],
                "correct_answer": "int[] arr = new int[];",
                "explanation": "Array size must be specified during initialization. You cannot create an array without specifying a size."
            },
            {
                "question": "What is the space complexity of a 2D array with m rows and n columns?",
                "options": ["O(1)", "O(m+n)", "O(m*n)", "O(log(m*n))"],
                "correct_answer": "O(m*n)",
                "explanation": "A 2D array stores m*n elements, so space complexity is proportional to the product of dimensions."
            }
        ],
        "Strings": [
            {
                "question": "What is the difference between == and .equals() for String comparison in Java?",
                "options": ["No difference", "== compares references, .equals() compares values", ".equals() compares references, == compares values", "== is faster"],
                "correct_answer": "== compares references, .equals() compares values",
                "explanation": "== checks if two references point to the same object. .equals() checks if the content of strings is identical."
            },
            {
                "question": "Which string method returns the index of the first occurrence of a substring?",
                "options": ["find()", "search()", "indexOf()", "locate()"],
                "correct_answer": "indexOf()",
                "explanation": "indexOf() is the Java String method that returns the index of the first occurrence of a character or substring. Returns -1 if not found."
            }
        ],
        "OOPS": [
            {
                "question": "What is encapsulation in Object-Oriented Programming?",
                "options": [
                    "Bundling data and methods that operate on data into a single unit (class)",
                    "Hiding implementation details and exposing only necessary functionality",
                    "Both bundling and hiding implementation details",
                    "Creating multiple instances of a class"
                ],
                "correct_answer": "Both bundling and hiding implementation details",
                "explanation": "Encapsulation combines data (attributes) and methods (behavior) into a class and hides internal implementation using access modifiers like private/protected."
            }
        ],
        "DBMS": [
            {
                "question": "Which of the following is NOT a ACID property?",
                "options": ["Atomicity", "Consistency", "Isolation", "Dependency"],
                "correct_answer": "Dependency",
                "explanation": "ACID stands for Atomicity, Consistency, Isolation, and Durability. Dependency is not part of ACID properties."
            }
        ]
    }
    
    # Get questions from topic or use a default
    questions = fallback_bank.get(topic, fallback_bank.get("Arrays", []))
    
    # Repeat if needed
    if len(questions) < count:
        questions = (questions * ((count // len(questions)) + 1))[:count]
    
    return questions[:count]


def generate_ai_questions(request: AIQuestionRequest, db: Session) -> Quiz:
    """
    Generate AI questions and save to DB
    First checks DB for existing questions, then generates AI if needed
    Returns Quiz object (not response)
    """
    
    questions = None
    source = "Unknown"
    question_type = getattr(request, "question_type", "MCQ")
    
    try:
        # Check if we have BANK questions in DB for this topic (quiz_id must be NULL)
        existing_questions = db.query(Question).filter(
            Question.quiz_id == None,  # Only bank questions
            Question.company == request.company,
            Question.track == request.track,
            Question.exam_type == request.exam_type,
            Question.category == request.category,
            Question.topic == request.topic
        ).limit(request.num_questions).all()
        
        if len(existing_questions) >= request.num_questions:
            logger.info(f"Using {len(existing_questions)} questions from database")
            # Create quiz with existing questions
            quiz = Quiz(
                company=request.company,
                track=request.track,
                exam_type=request.exam_type,
                category=request.category,
                topic=request.topic,
                difficulty=request.difficulty,
                question_type=question_type,
                question_count=len(existing_questions)
            )
            db.add(quiz)
            db.flush()
            
            # Associate existing questions with this quiz
            for q in existing_questions:
                q.quiz_id = quiz.id
            
            db.commit()
            return quiz
        
        # Step 1: Call OpenAI
        logger.info(f"Generating {request.num_questions} questions via AI")
        prompt = build_prompt(request)
        raw_output = call_openai(prompt)
        
        logger.info(f"AI Response received: {len(raw_output)} chars")
        
        # Step 2: Parse JSON
        questions = json.loads(raw_output)
        
        # Step 3: Validate
        if not validate_ai_output(questions):
            raise ValueError("Invalid AI output structure")
        
        source = "AI"
        logger.info(f"Generated {len(questions)} questions via AI")
    
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")
        questions = get_fallback_questions(request.topic, request.difficulty, request.num_questions)
        source = "Fallback_JsonError"
    except Exception as e:
        logger.error(f"AI generation failed: {str(e)}")
        questions = get_fallback_questions(request.topic, request.difficulty, request.num_questions)
        source = "Fallback_GeneralError"
    
    # Step 4: Create Quiz record in DB
    quiz = Quiz(
        company=request.company,
        track=request.track,
        exam_type=request.exam_type,
        category=request.category,
        topic=request.topic,
        difficulty=request.difficulty,
        question_type=question_type,
        question_count=len(questions)
    )
    db.add(quiz)
    db.flush()  # Get quiz.id without committing
    
    # Step 5: Create Question records (DO NOT EXPOSE correct_answer yet)
    question_objects = []
    for q in questions:
        question_obj = Question(
            quiz_id=quiz.id,
            company=request.company,
            track=request.track,
            exam_type=request.exam_type,
            category=request.category,
            topic=request.topic,
            difficulty=request.difficulty,
            question_type=question_type,
            question=q["question"],
            options=q["options"],
            correct_answer=q["correct_answer"],
            explanation=q.get("explanation", ""),
            source=source,
            approved=False
        )
        db.add(question_obj)
        question_objects.append(question_obj)
    
    db.commit()
    return quiz



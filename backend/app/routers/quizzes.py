from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

# Simple in-memory quiz data to start — replace with DB-backed models later
QUIZ_STORE = {
	1: {
		"id": 1,
		"title": "Aptitude",
		"questions": [
			{"q": "What is 12 + 8?", "options": ["10", "18", "20", "22"], "answer": 1, "difficulty": "Easy"},
			{"q": "Which number is divisible by 9?", "options": ["27", "28", "26", "25"], "answer": 0, "difficulty": "Medium"}
		],
	},
	2: {
		"id": 2,
		"title": "Technical - Java",
		"questions": [
			{"q": "Which keyword creates a class in Java?", "options": ["define", "class", "struct", "public"], "answer": 1, "difficulty": "Easy"},
			{"q": "Which concept is NOT part of OOP?", "options": ["Inheritance", "Encapsulation", "Polymorphism", "Compilation"], "answer": 3, "difficulty": "Hard"}
		],
	},
	3: {
		"id": 3,
		"title": "Technical - Python",
		"questions": [
			{"q": "What does 'def' do in Python?", "options": ["Defines a function", "Deletes a file", "Breaks loop", "None"], "answer": 0, "difficulty": "Easy"},
			{"q": "Which data type is immutable?", "options": ["List", "Dictionary", "Tuple", "Set"], "answer": 2, "difficulty": "Medium"}
		],
	},
}


@router.get("/")
def list_quizzes():
	return [ {"id": q["id"], "title": q["title"], "questions": len(q["questions"]) } for q in QUIZ_STORE.values() ]


@router.get("/{quiz_id}")
def get_quiz(quiz_id: int):
	q = QUIZ_STORE.get(quiz_id)
	if not q:
		raise HTTPException(status_code=404, detail="Quiz not found")
	return q

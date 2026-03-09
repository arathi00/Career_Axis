from fastapi import APIRouter

router = APIRouter()

@router.get("/quizzes")
def get_quizzes():
    return {"message": "Quiz API working"}
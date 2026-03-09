from fastapi import APIRouter

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.get("/")
def test_resumes():
    return {"message": "Resumes router working"}
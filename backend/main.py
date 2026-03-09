from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.base import Base
from app.routers import auth, user, trainers, admins, quizzes, company_quiz, quiz_generator, chatbot

# -------------------------
# Create FastAPI app
# -------------------------
app = FastAPI(title="Career Axis API")

# -------------------------
# CORS Middleware (FIXED)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Create DB Tables
# -------------------------
Base.metadata.create_all(bind=engine)

# -------------------------
# Include Routers
# -------------------------
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(trainers.router)
app.include_router(admins.router)
app.include_router(quizzes.router)
app.include_router(company_quiz.router)
app.include_router(quiz_generator.router)  # ✅ NEW: Gemini → DB Quiz Generator
app.include_router(chatbot.router)  # ✅ NEW: Chatbot with Gemini AI

# -------------------------
# Root Endpoint
# -------------------------
@app.get("/")
def root():
    return {"message": "FastAPI + PostgreSQL connected successfully!"}

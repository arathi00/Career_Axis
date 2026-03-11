from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import engine
from app.database.base import Base
from importlib import import_module
from typing import List
from app.routers import quiz
from app.routers import admin_analytics


# -------------------------
# Create FastAPI App FIRST
# -------------------------
app = FastAPI(title="Career Axis API")

# -------------------------
# CORS Middleware (only once)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Create DB Tables
# -------------------------
Base.metadata.create_all(bind=engine)

app.include_router(quiz.router)
app.include_router(admin_analytics.router)
# -------------------------
# Include Routers
# -------------------------
router_names: List[str] = [
    "auth",
    "admins",
    "admin_quiz",  # Added this to the list
    "resumes",
    "quizzes",
    "interviews",
    "chatbot",
    "dashboard",
]

for name in router_names:
    try:
        mod = import_module(f"app.routers.{name}")
        if hasattr(mod, "router"):
            app.include_router(mod.router)
            print(f"✅ Loaded router: {name}")  
        else:
            print(f"⚠️ No router found in: {name}")
    except ImportError as e:
        print(f"❌ Failed to import {name}: {e}")
    except Exception as e:
        print(f"❌ Error loading {name}: {e}")

# -------------------------
# Root Endpoint
# -------------------------
@app.get("/")
def root():
    return {"message": "FastAPI + PostgreSQL connected successfully!"}
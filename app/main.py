from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from importlib import import_module
from typing import List

from app.database.session import engine
from app.database.base import Base

# -------------------------
# Create FastAPI App
# -------------------------
app = FastAPI(title="Career Axis API")

# -------------------------
# CORS Middleware
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
router_names: List[str] = [
    "auth",
    "admins",
    "admin_quiz",
    "admin_analytics",
    "resumes",
    "quiz",
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
    except Exception as e:
        print(f"❌ Error loading {name}: {e}")

# -------------------------
# Root Endpoint
# -------------------------
@app.get("/")
def root():
    return {"message": "FastAPI + PostgreSQL connected successfully!"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.base import Base
from app.routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Career Axis API")

# ✅ ADD THIS BLOCK (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "FastAPI + PostgreSQL connected successfully!"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.base import Base
from app.routers import auth, resumes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Career Axis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resumes.router)

@app.get("/")
def root():
    return {"message": "FastAPI + PostgreSQL connected successfully!"}

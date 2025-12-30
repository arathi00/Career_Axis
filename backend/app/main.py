from fastapi import FastAPI

from app.database.database import engine
from app.database.base import Base
from app.routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Career Axis API")

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "FastAPI + PostgreSQL connected successfully!"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.database.database import engine
from app.database.base import Base
from app.routers import auth, resumes, user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Career Axis API")

#app.add_middleware(
    #CORSMiddleware,
    #allow_origins=["*"],
    #allow_credentials=True,
    #allow_methods=["*"],
   # allow_headers=["*"],
#)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",    # Vite dev server
        "http://127.0.0.1:5173",    # Alternative
        "http://localhost:3000",    # React dev server (if using)
        "http://127.0.0.1:3000",    # Alternative
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"message": "FastAPI + PostgreSQL connected successfully!"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",  # or just "app" if you're running from this file directly
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )
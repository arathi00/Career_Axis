import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Explicitly load .env file from backend directory
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Career Axis"

    # 🔐 Auth / JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # 🗄️ Database
    DATABASE_URL: str

    # 🤖 Gemini API
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

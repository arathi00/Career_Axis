from pydantic_settings import BaseSettings
from datetime import timedelta, datetime
from jose import jwt

class Settings(BaseSettings):
    DATABASE_URL: str

    class Config:
        env_file = ".env"

settings = Settings()

SECRET_KEY = "career_axis_secret"
ALGORITHM = "HS256"

def create_token(data: dict):
    data["exp"] = datetime.utcnow() + timedelta(hours=1)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
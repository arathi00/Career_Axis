from pydantic_settings import BaseSettings
from datetime import timedelta
from jose import jwt

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "secretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"


settings = Settings()


def create_token(data: dict):
    to_encode = data.copy()
    expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

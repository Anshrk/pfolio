import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import List

# Automatically search for .env in current dir or backend/ directory
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "MacBook Terminal Portfolio API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./portfolio.db"
    )
    SQLITE_FALLBACK_URL: str = "sqlite:///./portfolio.db"
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "macbook-terminal-portfolio-secret-key-2026-ansh")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Admin Credentials (set in backend/.env)
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()

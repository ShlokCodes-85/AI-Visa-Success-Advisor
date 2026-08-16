import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings and configuration"""
    
    # Server
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    # Database
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "visa-advisor")
    
    # LLM Configuration for Form Mode
    FORM_LLM_PROVIDER = os.getenv("FORM_LLM_PROVIDER", "gemini")
    FORM_LLM_API_KEY = os.getenv("FORM_LLM_API_KEY", "")
    FORM_LLM_MODEL = os.getenv("FORM_LLM_MODEL", "gemini-2.5-flash")
    
    # CORS - Load from environment, with sensible safe defaults
    _allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "")
    # If not specified, allow all origins to avoid startup failure (can be tightened in production)
    if not _allowed_origins_str:
        ALLOWED_ORIGINS = ["*"]
    else:
        ALLOWED_ORIGINS = [origin.strip() for origin in _allowed_origins_str.split(",") if origin.strip()]

settings = Settings()

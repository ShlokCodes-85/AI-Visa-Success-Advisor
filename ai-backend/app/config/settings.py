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
    
    # LLM Configuration for Chat Mode
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")  # openai, gemini, anthropic, local, xai
    LLM_API_KEY = os.getenv("LLM_API_KEY", "")
    LLM_MODEL = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
    
    # LLM Configuration for Form Mode (can be different from chat mode)
    FORM_LLM_PROVIDER = os.getenv("FORM_LLM_PROVIDER", "openai")  # openai, gemini, anthropic, local, xai
    FORM_LLM_API_KEY = os.getenv("FORM_LLM_API_KEY", "")
    FORM_LLM_MODEL = os.getenv("FORM_LLM_MODEL", "gpt-3.5-turbo")
    
    # Node.js Backend
    NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", os.getenv("NODE_BACKEND_URL_LOCAL", "http://localhost:5000"))
    
    # CORS
    ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5000",
    ]
    
    # Chat Configuration
    MAX_CHAT_HISTORY = 50
    SYSTEM_PROMPT = """You are an AI Visa Success Advisor. You help students with:
- Visa application processes and requirements
- Document preparation and submission
- Interview preparation and tips
- University and course selection
- Financial and sponsor documentation
- Home country ties and proof of residence

Always provide accurate, helpful, and supportive guidance.
If the user asks for a specific length or format (e.g., "2 lines"), comply.
If unsure, recommend consulting official resources or immigration lawyers."""

settings = Settings()

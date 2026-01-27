"""
FastAPI main application file
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.routes.chat import router as chat_router

# Create FastAPI app
app = FastAPI(
    title="AI Visa Success Advisor - Chat API",
    description="Python backend for AI-powered visa application assistance",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(chat_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Visa Success Advisor - Chat API",
        "docs": "/docs",
        "health": "/api/chat/health"
    }


@app.get("/health")
async def health():
    """Global health check"""
    return {
        "status": "healthy",
        "service": "AI Visa Advisor Chat API",
        "llm_provider": settings.LLM_PROVIDER,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )

"""
FastAPI main application file
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.routes.form import router as form_router

# Create FastAPI app
app = FastAPI(
    title="AI Visa Success Advisor - Form Analysis API",
    description="Python backend for AI-powered visa application form analysis",
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
app.include_router(form_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Visa Success Advisor - Form Analysis API",
        "docs": "/docs",
        "health": "/api/form/health"
    }




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )

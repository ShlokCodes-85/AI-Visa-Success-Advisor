"""
Chat routes for FastAPI
"""
from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional
from app.models.chat import ChatMessage, ChatResponse, ErrorResponse
from app.services.chat_service import chat_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(
    payload: ChatMessage,
    x_chat_id: str = Header(..., alias="X-Chat-Id"),
    x_user_id: str = Header(..., alias="X-User-Id"),
) -> ChatResponse:
    """
    Send a message to the AI advisor and get a response
    
    Headers:
        X-Chat-Id: ID of the chat
        X-User-Id: ID of the authenticated user
    """
    try:
        if not payload.message or not payload.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        print(f"Route: Received payload with documents: {payload.documents is not None}")
        if payload.documents:
            print(f"Route: Number of documents: {len(payload.documents)}")
            for doc in payload.documents:
                print(f"Route: Document name: {doc.get('name')}, Content length: {len(doc.get('content', ''))}")
        
        # Process the message
        response = await chat_service.process_message(
            chat_id=x_chat_id,
            user_id=x_user_id,
            user_message=payload.message,
            documents=payload.documents,
        )
        
        return ChatResponse(
            success=True,
            response=response,
            chat_id=x_chat_id,
            timestamp=None,  # Will be set automatically
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing message: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": "AI Visa Advisor Chat API"
    }

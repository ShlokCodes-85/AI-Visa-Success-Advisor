"""
Pydantic models for chat-related data
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Message(BaseModel):
    """Message model for chat"""
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[datetime] = None


class ChatMessage(BaseModel):
    """Chat message request/response"""
    message: str = Field(..., min_length=1, max_length=5000)


class ChatResponse(BaseModel):
    """Chat response structure"""
    success: bool
    response: str
    chat_id: str
    timestamp: datetime


class ChatHistoryResponse(BaseModel):
    """Chat history response"""
    chat_id: str
    title: str
    messages: List[Message]
    created_at: datetime
    updated_at: datetime


class ErrorResponse(BaseModel):
    """Error response structure"""
    success: bool
    error: str
    details: Optional[str] = None

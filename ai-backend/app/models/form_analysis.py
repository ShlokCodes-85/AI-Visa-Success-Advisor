"""
MongoDB models for form analysis results
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId


class FormAnalysisModel(BaseModel):
    """MongoDB model for storing form analysis results"""
    
    id: Optional[str] = Field(default=None, alias="_id")
    email: str = Field(..., index=True)  # User email for retrieval
    user_id: Optional[str] = Field(default=None, index=True)
    form_data: Dict[str, Any]  # Original form data submitted
    analysis_results: Dict[str, Any]  # AI-generated analysis
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
    
    def dict(self, **kwargs):
        """Override dict to handle ObjectId"""
        data = super().dict(**kwargs)
        if isinstance(data.get('_id'), ObjectId):
            data['_id'] = str(data['_id'])
        return data


class FormAnalysisRequest(BaseModel):
    """Request model for form analysis with email"""
    form_data: Dict[str, Any]
    email: str  # Required for storage


class FormAnalysisResponse(BaseModel):
    """Response model for form analysis"""
    success: bool
    analysis_id: str
    email: str
    form_data: Dict[str, Any]
    analysis_results: Dict[str, Any]
    timestamp: datetime
    message: str = "Analysis saved successfully"


class FormAnalysisListResponse(BaseModel):
    """Response model for multiple analyses"""
    success: bool
    email: str
    count: int
    analyses: list
    message: str = "Analyses retrieved successfully"

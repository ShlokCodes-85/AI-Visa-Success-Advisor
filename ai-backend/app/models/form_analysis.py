from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


class ReasoningItem(BaseModel):
    factor: str
    impact: str
    description: str
    weight: float


class ImprovementItem(BaseModel):
    category: str
    suggestion: str
    priority: str


class AnalysisResults(BaseModel):
    percentage: int
    summary: Optional[str]
    reasoning: List[ReasoningItem]
    improvements: List[ImprovementItem]
    explanations: Optional[Dict[str, Any]] = None


class StoredAnalysis(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: Optional[str]
    email: Optional[str]
    title: Optional[str]
    form_data: Dict[str, Any]
    analysis_results: AnalysisResults
    created_at: Optional[Any]

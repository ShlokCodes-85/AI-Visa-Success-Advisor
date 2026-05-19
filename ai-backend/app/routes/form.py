"""
Form mode routes for FastAPI
Routes for form-specific LLM operations
"""
from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.services.form_llm_service import form_llm_service
from app.services.form_analysis_db import form_analysis_db
from app.models.form_analysis import StoredAnalysis

router = APIRouter(prefix="/api/form", tags=["form"])



class FormAnalysisRequest(BaseModel):
    """Request model for form analysis"""
    form_data: Dict[str, Any]
    email: Optional[str] = None  # Optional, can be used for frontend context


class FormAnalysisResponse(BaseModel):
    """Response model for form analysis results (computation only, no database storage)"""
    success: bool
    analysis_results: Dict[str, Any]  # Contains percentage, summary, reasoning, improvements, explanations
    message: str = "Analysis completed successfully"
    analysis_id: Optional[str] = None


class FormFieldRequest(BaseModel):
    """Request model for form field guidance"""
    field_name: str
    field_description: str
    user_context: Optional[str] = None


class FormValidationRequest(BaseModel):
    """Request model for form response validation"""
    field_name: str
    user_response: str
    field_requirements: Optional[str] = None


@router.post("/guidance")
async def get_form_guidance(
    request: FormFieldRequest,
    x_user_id: str = Header(..., alias="X-User-Id"),
) -> dict:
    """
    Get guidance for filling out a form field
    
    Headers:
        X-User-Id: ID of the authenticated user
    """
    try:
        if not request.field_name or not request.field_description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="field_name and field_description are required"
            )
        
        guidance = await form_llm_service.generate_form_guidance(
            field_name=request.field_name,
            field_description=request.field_description,
            user_context=request.user_context,
        )
        
        return {
            "success": True,
            "field_name": request.field_name,
            "guidance": guidance,
            "user_id": x_user_id,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating form guidance: {str(e)}"
        )


@router.post("/validate")
async def validate_form_response(
    request: FormValidationRequest,
    x_user_id: str = Header(..., alias="X-User-Id"),
) -> dict:
    """
    Validate a form field response and get feedback
    
    Headers:
        X-User-Id: ID of the authenticated user
    """
    try:
        if not request.field_name or not request.user_response:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="field_name and user_response are required"
            )
        
        validation_result = await form_llm_service.validate_form_response(
            field_name=request.field_name,
            user_response=request.user_response,
            field_requirements=request.field_requirements,
        )

        return {
            "success": True,
            **validation_result,
            "user_id": x_user_id,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error validating form response: {str(e)}"
        )


@router.post("/analyze")
async def analyze_application(
    request: FormAnalysisRequest,
    x_user_id: str = Header(..., alias="X-User-Id"),
) -> FormAnalysisResponse:
    """
    Analyze a full form submission and return results.
    Note: Database storage is handled by the Node.js backend.

    Headers:
        X-User-Id: ID of the authenticated user
    """
    try:
        if not request.form_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="form_data is required"
            )

        analysis = await form_llm_service.analyze_application(
            form_data=request.form_data,
        )

        # Persist analysis to MongoDB (Python backend stores form analyses)
        try:
            saved = form_analysis_db.save_analysis(
                user_id=x_user_id,
                email=request.email or "",
                title=None,
                form_data=request.form_data,
                analysis_results=analysis,
            )
            analysis_id = str(saved.get("_id"))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error saving analysis: {str(e)}")

        return FormAnalysisResponse(
            success=True,
            analysis_results=analysis,
            analysis_id=analysis_id,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating analysis: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint for form mode"""
    return {
        "status": "healthy",
        "service": "Form Mode LLM API",
        "form_llm_provider": "Configured via FORM_LLM_PROVIDER env",
    }



@router.get("/analyses/{email}")
async def get_analyses_by_email(email: str, x_user_id: str = Header(..., alias="X-User-Id")):
    """Fetch analyses for a given email address."""
    try:
        docs = form_analysis_db.get_analyses_by_email(email)
        transformed = []
        for d in docs:
            transformed.append({
                "_id": str(d.get("_id")),
                "title": d.get("title"),
                "email": d.get("email"),
                "percentage": d.get("analysis_results", {}).get("percentage"),
                "created_at": d.get("created_at").isoformat() if d.get("created_at") else None,
            })
        return {"success": True, "analyses": transformed}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching analyses: {str(e)}")


@router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str, x_user_id: str = Header(..., alias="X-User-Id")):
    """Fetch a specific analysis by ID."""
    try:
        doc = form_analysis_db.get_analysis_by_id(analysis_id)
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")

        transformed = {
            "_id": str(doc.get("_id")),
            "title": doc.get("title"),
            "email": doc.get("email"),
            "percentage": doc.get("analysis_results", {}).get("percentage"),
            "reasoning": doc.get("analysis_results", {}).get("reasoning", []),
            "improvements": doc.get("analysis_results", {}).get("improvements", []),
            "form_data": doc.get("form_data", {}),
            "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
        }

        return {"success": True, "analysis": transformed}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching analysis: {str(e)}")


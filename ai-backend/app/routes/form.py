"""
Form mode routes for FastAPI
Routes for form-specific LLM operations
"""
from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional
from pydantic import BaseModel
from app.services.form_llm_service import form_llm_service

router = APIRouter(prefix="/api/form", tags=["form"])


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


@router.get("/health")
async def health_check():
    """
    Health check endpoint for form mode
    """
    return {
        "status": "healthy",
        "service": "Form Mode LLM API",
        "llm_provider": "FORM_LLM_PROVIDER (to be configured)",
    }

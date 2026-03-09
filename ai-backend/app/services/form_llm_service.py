"""
Form Mode LLM Service - handles communication with LLM provider for form mode
This allows using a different LLM provider for form mode compared to chat mode
"""
from typing import List, Dict, Any
import json
import re
from app.utils.llm_providers import get_llm_provider, LLMProvider, XAIProvider
from app.config.settings import settings
from app.services.explainability import generate_explanations


class FormLLMService:
    """Service for managing Form Mode LLM interactions"""
    
    def __init__(self):
        # Use form-specific LLM provider configuration
        self.provider_name = settings.FORM_LLM_PROVIDER
        self.api_key = settings.FORM_LLM_API_KEY
        self.model = settings.FORM_LLM_MODEL
        
        self.provider: LLMProvider = self._initialize_form_provider()
        self.system_prompt = """You are an expert visa application advisor specializing in helping applicants fill out visa forms.
Your role is to:
- Provide clear, concise guidance for each form field
- Suggest appropriate answers based on visa requirements
- Help clarify form requirements and instructions
- Ensure all information is accurate and relevant
- Suggest improvements to form responses

Always be professional, accurate, and compliant with visa regulations."""
    
    def _initialize_form_provider(self) -> LLMProvider:
        """Initialize LLM provider with form mode configuration"""
        from app.utils.llm_providers import OpenAIProvider, GeminiProvider, DeepSeekProvider
        
        api_key = self.api_key or settings.LLM_API_KEY
        
        if self.provider_name.lower() == "openai":
            return OpenAIProvider(api_key=api_key, model=self.model)
        elif self.provider_name.lower() == "xai":
            return XAIProvider(api_key=api_key, model=self.model)
        elif self.provider_name.lower() == "deepseek":
            return DeepSeekProvider(api_key=api_key, model=self.model)
        elif self.provider_name.lower() == "gemini":
            return GeminiProvider(api_key=api_key, model=self.model)
        else:
            # Fallback to default provider
            return get_llm_provider()
    
    async def generate_form_guidance(
        self,
        field_name: str,
        field_description: str,
        user_context: str = None,
        temperature: float = 0.5,  # Lower temperature for form responses (more consistent)
    ) -> str:
        """
        Generate guidance for a specific form field
        
        Args:
            field_name: Name of the form field
            field_description: Description/instructions for the field
            user_context: User's background information if any
            temperature: Controls randomness of response (lower = more consistent)
            
        Returns:
            Generated guidance text
        """
        try:
            user_message = f"""Help me fill out this form field:

Field Name: {field_name}
Instructions: {field_description}"""
            
            if user_context:
                user_message += f"\n\nMy Context: {user_context}"
            
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            response = await self.provider.generate_response(messages, temperature)
            return response
        
        except Exception as e:
            raise Exception(f"Error generating form guidance: {str(e)}")
    
    async def validate_form_response(
        self,
        field_name: str,
        user_response: str,
        field_requirements: str = None,
    ) -> Dict[str, any]:
        """
        Validate and provide feedback on a form response
        
        Args:
            field_name: Name of the form field
            user_response: User's answer to the field
            field_requirements: Specific requirements for the field
            
        Returns:
            Dictionary with validation result and suggestions
        """
        try:
            requirements_text = f"\n\nField Requirements: {field_requirements}" if field_requirements else ""
            
            user_message = f"""Please review my form field response for accuracy and completeness:

Field Name: {field_name}
My Response: {user_response}{requirements_text}

Provide feedback on:
1. Whether the response is appropriate
2. Any improvements needed
3. Potential issues with the response"""
            
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            response = await self.provider.generate_response(messages, temperature=0.5)
            
            return {
                "field_name": field_name,
                "feedback": response,
                "timestamp": None
            }
        
        except Exception as e:
            raise Exception(f"Error validating form response: {str(e)}")
    
    def change_provider(self, provider_name: str, api_key: str, model: str):
        """
        Change the LLM provider for form mode
        
        Args:
            provider_name: Name of the provider (openai, gemini, etc.)
            api_key: API key for the provider
            model: Model name to use
        """
        self.provider_name = provider_name
        self.api_key = api_key
        self.model = model
        self.provider = self._initialize_form_provider()

    async def analyze_application(
        self,
        form_data: Dict[str, Any],
        temperature: float = 0.4,
    ) -> Dict[str, Any]:
        """
        Generate a structured analysis for the Results dashboard.
        """
        try:
            system_prompt = """You are an expert visa application analyst.
Return ONLY valid JSON following this schema:
{
  "percentage": number (0-100),
  "summary": string,
  "reasoning": [
    {"factor": string, "impact": "positive"|"negative"|"neutral", "description": string, "weight": number (0-1)}
  ],
  "improvements": [
    {"category": string, "suggestion": string, "priority": "high"|"medium"|"low"}
  ]
}
Constraints:
- Use 4-6 reasoning items.
- Weights must sum roughly to 1.0.
- Percentage should align with reasoning impacts.
- Treat `requiredFunding` as the college-required amount mentioned in the applicant's I-20 for one year.
- In financial reasoning/improvements, explicitly reference one-year I-20 amount coverage.
"""

            user_message = {
                "form_data": form_data
            }

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(user_message)}
            ]

            raw_response = await self.provider.generate_response(messages, temperature)
            parsed = _safe_json_extract(raw_response)

            if not _is_valid_analysis_payload(parsed):
                retry_system_prompt = """You are an expert visa application analyst.
Return ONLY valid JSON. No markdown. No extra text.
Schema:
{
  "percentage": number (0-100),
  "summary": string,
  "reasoning": [
    {"factor": string, "impact": "positive"|"negative"|"neutral", "description": string, "weight": number (0-1)}
  ],
  "improvements": [
    {"category": string, "suggestion": string, "priority": "high"|"medium"|"low"}
  ]
}
Rules:
- Use exactly 5 reasoning items and exactly 3 improvements.
- Keep summary under 40 words.
- Keep each description and suggestion under 18 words.
- Weights must sum to 1.0.
- Treat `requiredFunding` as the college-required amount mentioned in I-20 for one year.
"""
                retry_messages = [
                    {"role": "system", "content": retry_system_prompt},
                    {"role": "user", "content": json.dumps(user_message)}
                ]
                retry_raw_response = await self.provider.generate_response(retry_messages, 0.2)
                retry_parsed = _safe_json_extract(retry_raw_response)
                if _is_valid_analysis_payload(retry_parsed):
                    parsed = retry_parsed

            # Normalize output
            percentage = int(max(0, min(100, round(float(parsed.get("percentage", 0))))))
            reasoning = parsed.get("reasoning", [])
            improvements = parsed.get("improvements", [])

            # Clamp weights and normalize if needed
            weights = [float(item.get("weight", 0.0) or 0.0) for item in reasoning]
            total_weight = sum(weights) if weights else 0.0
            if total_weight > 0:
                for item in reasoning:
                    item["weight"] = round(float(item.get("weight", 0.0)) / total_weight, 4)

            explanations = generate_explanations(reasoning)

            return {
                "percentage": percentage,
                "summary": parsed.get("summary", ""),
                "reasoning": reasoning,
                "improvements": improvements,
                "explanations": explanations,
            }

        except Exception as e:
            raise Exception(f"Error generating analysis: {str(e)}")


def _safe_json_extract(text: str) -> Dict[str, Any]:
    """
    Extract JSON object from LLM response safely.
    """
    # Strip markdown code blocks
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            return {}
        try:
            return json.loads(match.group(0))
        except Exception:
            return {}


def _is_valid_analysis_payload(payload: Dict[str, Any]) -> bool:
    if not isinstance(payload, dict):
        return False
    if "percentage" not in payload or "reasoning" not in payload or "improvements" not in payload:
        return False
    if not isinstance(payload.get("reasoning"), list) or not isinstance(payload.get("improvements"), list):
        return False
    return True


# Global instance
form_llm_service = FormLLMService()

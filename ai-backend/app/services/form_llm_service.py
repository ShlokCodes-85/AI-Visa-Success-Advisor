"""
Form Mode LLM Service - handles communication with LLM provider for form mode
This allows using a different LLM provider for form mode compared to chat mode
"""
from typing import List, Dict
from app.utils.llm_providers import get_llm_provider, LLMProvider
from app.config.settings import settings


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
        # TODO: Update this method to use FORM_LLM_PROVIDER settings
        # Currently uses the same provider system, but can be extended to support different providers
        from app.utils.llm_providers import OpenAIProvider, GeminiProvider
        
        api_key = self.api_key or settings.LLM_API_KEY
        
        if self.provider_name.lower() == "openai":
            return OpenAIProvider(api_key=api_key, model=self.model)
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


# Global instance
form_llm_service = FormLLMService()

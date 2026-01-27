"""
LLM Service - handles communication with LLM providers
"""
from typing import List, Dict
from app.utils.llm_providers import get_llm_provider, LLMProvider
from app.config.settings import settings


class LLMService:
    """Service for managing LLM interactions"""
    
    def __init__(self):
        self.provider: LLMProvider = get_llm_provider()
        self.system_prompt = settings.SYSTEM_PROMPT
    
    async def generate_response(
        self,
        user_message: str,
        chat_history: List[Dict[str, str]] = None,
        temperature: float = 0.7,
    ) -> str:
        """
        Generate an AI response to a user message
        
        Args:
            user_message: The user's input message
            chat_history: Previous messages in the conversation
            temperature: Controls randomness of response
            
        Returns:
            Generated response text
        """
        try:
            # Build messages list with system prompt
            messages = [
                {"role": "system", "content": self.system_prompt}
            ]
            
            # Add chat history if provided
            if chat_history:
                messages.extend(chat_history)
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            # Get response from LLM provider
            response = await self.provider.generate_response(messages, temperature)
            
            return response
        
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")
    
    def reload_provider(self):
        """Reload LLM provider (useful for changing configuration)"""
        self.provider = get_llm_provider()


# Global instance
llm_service = LLMService()

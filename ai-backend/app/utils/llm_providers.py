"""
Modular LLM providers - easily swap between different LLM services
"""
from abc import ABC, abstractmethod
from typing import Optional
from app.config.settings import settings


class LLMProvider(ABC):
    """Abstract base class for LLM providers"""
    
    @abstractmethod
    async def generate_response(self, messages: list, temperature: float = 0.7) -> str:
        """
        Generate a response from the LLM
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Controls randomness (0-1)
            
        Returns:
            Generated text response
        """
        pass


class OpenAIProvider(LLMProvider):
    """OpenAI GPT provider"""
    
    def __init__(self, api_key: str, model: str = "gpt-3.5-turbo"):
        self.api_key = api_key
        self.model = model
        try:
            import openai
            self.client = openai.AsyncOpenAI(api_key=api_key)
        except ImportError:
            raise ImportError("openai package not installed. Run: pip install openai")
    
    async def generate_response(self, messages: list, temperature: float = 0.7) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")


class XAIProvider(LLMProvider):
    """xAI Grok provider (OpenAI-compatible API)"""

    def __init__(self, api_key: str, model: str = "grok-4-1-fast-reasoning"):
        self.api_key = api_key
        self.model = model
        try:
            import openai
            self.client = openai.AsyncOpenAI(
                api_key=api_key,
                base_url="https://api.x.ai/v1",
            )
        except ImportError:
            raise ImportError("openai package not installed. Run: pip install openai")

    async def generate_response(self, messages: list, temperature: float = 0.7) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=1200,
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"xAI API error: {str(e)}")


class DeepSeekProvider(LLMProvider):
    """DeepSeek provider (OpenAI-compatible API)"""

    def __init__(self, api_key: str, model: str = "deepseek-chat"):
        self.api_key = api_key
        self.model = model
        try:
            import openai
            self.client = openai.AsyncOpenAI(
                api_key=api_key,
                base_url="https://api.deepseek.com",
            )
        except ImportError:
            raise ImportError("openai package not installed. Run: pip install openai")

    async def generate_response(self, messages: list, temperature: float = 0.7) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=1200,
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"DeepSeek API error: {str(e)}")


class GeminiProvider(LLMProvider):
    """Google Gemini provider"""

    def __init__(self, api_key: str, model: str = "gemini-2.5-flash"):
        self.api_key = api_key
        self.model = model
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            self.client = genai.GenerativeModel(model)
        except ImportError:
            raise ImportError("google-generativeai package not installed. Run: pip install google-generativeai")
    
    async def generate_response(self, messages: list, temperature: float = 0.7) -> str:
        try:
            # Build conversation context from messages
            history = []
            for i, msg in enumerate(messages[:-1]):
                role = msg.get("role", "user")
                content = msg.get("content", "")
                
                # Skip system messages in history (Gemini doesn't support system role in history)
                if role == "system":
                    continue
                    
                # Convert to Gemini format
                gemini_role = "user" if role == "user" else "model"
                history.append({
                    "role": gemini_role,
                    "parts": [content]
                })
            
            # Start chat with history
            chat = self.client.start_chat(history=history)
            
            # Get the latest user message
            user_message = messages[-1]["content"]
            
            # Add system prompt context to the first message if present
            system_context = ""
            for msg in messages:
                if msg.get("role") == "system":
                    system_context = msg.get("content", "")
                    break
            
            if system_context and not history:
                user_message = f"{system_context}\n\nUser: {user_message}"
            
            # Generate response
            response = chat.send_message(
                user_message,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": 3000,
                }
            )
            # Strip markdown code blocks if present
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]  # Remove ```json
            if text.startswith("```"):
                text = text[3:]  # Remove ```
            if text.endswith("```"):
                text = text[:-3]  # Remove trailing ```
            return text.strip()
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")


class AnthropicProvider(LLMProvider):
    """Anthropic Claude provider"""
    
    def __init__(self, api_key: str, model: str = "claude-3-sonnet-20240229"):
        self.api_key = api_key
        self.model = model
        try:
            from anthropic import AsyncAnthropic
            self.client = AsyncAnthropic(api_key=api_key)
        except ImportError:
            raise ImportError("anthropic package not installed. Run: pip install anthropic")
    
    async def generate_response(self, messages: list, temperature: float = 0.7) -> str:
        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                temperature=temperature,
                messages=messages,
            )
            return response.content[0].text
        except Exception as e:
            raise Exception(f"Anthropic API error: {str(e)}")


class LocalLLMProvider(LLMProvider):
    """Local LLM provider (Ollama, etc.)"""
    
    def __init__(self, api_url: str = "http://localhost:11434", model: str = "llama2"):
        self.api_url = api_url
        self.model = model
        try:
            import httpx
            self.client = httpx.AsyncClient()
        except ImportError:
            raise ImportError("httpx package not installed. Run: pip install httpx")
    
    async def generate_response(self, messages: list, temperature: float = 0.7) -> str:
        try:
            # Convert to Ollama format
            prompt = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
            
            response = await self.client.post(
                f"{self.api_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "temperature": temperature,
                    "stream": False,
                }
            )
            result = response.json()
            return result.get("response", "")
        except Exception as e:
            raise Exception(f"Local LLM error: {str(e)}")


class DummyProvider(LLMProvider):
    """Dummy provider for testing without API keys"""
    
    async def generate_response(self, messages: list, temperature: float = 0.7) -> str:
        # Return a dummy response based on user message
        user_message = messages[-1]["content"].lower()
        
        responses = {
            "visa": "Visa applications typically require documents like passport, educational certificates, and financial proofs. Could you be more specific about which visa type you're interested in?",
            "document": "Important visa documents include: passport, academic transcripts, English language test scores, financial statements, and sponsor information.",
            "interview": "For visa interviews, prepare by reviewing your application, practicing common questions, and having all documents ready. Dress professionally and arrive early.",
            "university": "When selecting a university, consider factors like reputation, location, program quality, cost, and post-graduation opportunities.",
        }
        
        for key, response in responses.items():
            if key in user_message:
                return response
        
        return "Thank you for your question. Could you provide more details so I can assist you better with your visa application journey?"


def get_llm_provider() -> LLMProvider:
    """
    Factory function to get the appropriate LLM provider
    based on configuration
    """
    provider = settings.LLM_PROVIDER.lower()
    api_key = settings.LLM_API_KEY
    model = settings.LLM_MODEL
    
    if provider == "openai":
        if not api_key:
            raise ValueError("LLM_API_KEY not set for OpenAI provider")
        return OpenAIProvider(api_key, model)

    elif provider == "xai":
        if not api_key:
            raise ValueError("LLM_API_KEY not set for xAI provider")
        return XAIProvider(api_key, model)

    elif provider == "deepseek":
        if not api_key:
            raise ValueError("LLM_API_KEY not set for DeepSeek provider")
        return DeepSeekProvider(api_key, model)
    
    elif provider == "gemini":
        if not api_key:
            raise ValueError("LLM_API_KEY not set for Gemini provider")
        return GeminiProvider(api_key, model)
    
    elif provider == "anthropic":
        if not api_key:
            raise ValueError("LLM_API_KEY not set for Anthropic provider")
        return AnthropicProvider(api_key, model)
    
    elif provider == "local":
        return LocalLLMProvider(model=model)
    
    elif provider == "dummy":
        return DummyProvider()
    
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")

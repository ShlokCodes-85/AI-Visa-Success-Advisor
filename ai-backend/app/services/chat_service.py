"""
Chat Service - handles chat logic and integration with Node backend
"""
from typing import List, Dict, Optional
import httpx
from app.config.settings import settings
from app.services.llm_service import llm_service


class ChatService:
    """Service for managing chat operations"""
    
    def __init__(self):
        self.node_backend_url = settings.NODE_BACKEND_URL
        self.http_client = httpx.AsyncClient()
    
    async def get_chat_history(self, chat_id: str, user_id: str) -> List[Dict]:
        """
        Fetch chat history from Node backend
        
        Args:
            chat_id: ID of the chat
            user_id: ID of the user (for authorization)
            
        Returns:
            List of messages in the chat
        """
        try:
            response = await self.http_client.get(
                f"{self.node_backend_url}/api/chats/{chat_id}/messages",
                params={"userId": user_id}
            )
            if response.status_code == 200:
                return response.json().get("messages", [])
            return []
        except Exception as e:
            print(f"Error fetching chat history: {e}")
            return []
    
    async def save_message(
        self,
        chat_id: str,
        user_id: str,
        role: str,
        content: str,
    ) -> bool:
        """
        Save a message to the database via Node backend
        
        Args:
            chat_id: ID of the chat
            user_id: ID of the user
            role: "user" or "assistant"
            content: Message content
            
        Returns:
            True if successful, False otherwise
        """
        try:
            response = await self.http_client.post(
                f"{self.node_backend_url}/api/chats/{chat_id}/messages",
                json={
                    "userId": user_id,
                    "role": role,
                    "content": content,
                }
            )
            return response.status_code == 201
        except Exception as e:
            print(f"Error saving message: {e}")
            return False
    
    async def process_message(
        self,
        chat_id: str,
        user_id: str,
        user_message: str,
        documents: list = None,
    ) -> str:
        """
        Process a user message and generate an AI response
        
        Args:
            chat_id: ID of the chat
            user_id: ID of the user
            user_message: The user's message
            documents: List of document dicts with {name, content, type}
            
        Returns:
            AI-generated response
        """
        try:
            # Prepare message with document context
            full_message = user_message
            if documents:
                print(f"Processing {len(documents)} document(s)")
                doc_context = "\n\n[ATTACHED DOCUMENTS]:\n"
                for doc in documents:
                    doc_name = doc.get('name', 'unknown')
                    doc_content = doc.get('content', '')
                    print(f"Document: {doc_name}, Content length: {len(doc_content)}")
                    doc_context += f"\n--- Document: {doc_name} ---\n"
                    doc_context += f"{doc_content[:1000]}\n"  # Limit to first 1000 chars per document
                full_message = user_message + doc_context
                print(f"Full message length with documents: {len(full_message)}")
            else:
                print("No documents provided")
            
            # Save user message
            await self.save_message(chat_id, user_id, "user", full_message)
            
            # Get chat history for context
            history = await self.get_chat_history(chat_id, user_id)
            
            # Convert history to format for LLM
            chat_history = [
                {"role": msg.get("role", "user"), "content": msg.get("content", "")}
                for msg in history[:-1]  # Exclude the message we just saved
                if msg.get("role") in ["user", "assistant"]
            ]
            
            # Generate response
            response = await llm_service.generate_response(
                user_message=full_message,
                chat_history=chat_history,
            )
            
            # Save assistant response
            await self.save_message(chat_id, user_id, "assistant", response)
            
            return response
        
        except Exception as e:
            raise Exception(f"Error processing message: {str(e)}")


# Global instance
chat_service = ChatService()

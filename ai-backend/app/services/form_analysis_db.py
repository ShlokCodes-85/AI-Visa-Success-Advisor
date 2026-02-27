"""
Database service for form analysis results
Handles MongoDB operations for storing and retrieving form analysis
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)


class FormAnalysisDB:
    """Database service for form analysis storage"""
    
    def __init__(self):
        """Initialize MongoDB connection"""
        self.client = MongoClient(settings.MONGODB_URI)
        self.db = self.client[settings.DATABASE_NAME]
        self.collection = self.db["form_analyses"]
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Create necessary MongoDB indexes"""
        try:
            # Index on email for fast retrieval
            self.collection.create_index("email")
            # Index on user_id for fast retrieval
            self.collection.create_index("user_id")
            # Index on timestamp for sorting
            self.collection.create_index("timestamp", direction=-1)
            # Compound index on email and timestamp
            self.collection.create_index([("email", -1), ("timestamp", -1)])
            logger.info("Database indexes created successfully")
        except PyMongoError as e:
            logger.error(f"Error creating indexes: {str(e)}")
    
    async def save_analysis(
        self,
        email: str,
        form_data: Dict[str, Any],
        analysis_results: Dict[str, Any],
        user_id: Optional[str] = None,
    ) -> str:
        """
        Save form analysis results to MongoDB
        
        Args:
            email: User's email address
            form_data: Original form data submitted
            analysis_results: AI-generated analysis
            user_id: Optional user ID
            
        Returns:
            Analysis ID (MongoDB ObjectId as string)
        """
        try:
            analysis_doc = {
                "email": email,
                "user_id": user_id,
                "form_data": form_data,
                "analysis_results": analysis_results,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "timestamp": datetime.utcnow(),
            }
            
            result = self.collection.insert_one(analysis_doc)
            logger.info(f"Analysis saved for email: {email} with ID: {result.inserted_id}")
            return str(result.inserted_id)
        
        except PyMongoError as e:
            logger.error(f"Error saving analysis to MongoDB: {str(e)}")
            raise Exception(f"Failed to save analysis: {str(e)}")
    
    async def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict]:
        """
        Retrieve analysis by ID
        
        Args:
            analysis_id: MongoDB ObjectId as string
            
        Returns:
            Analysis document or None
        """
        try:
            analysis = self.collection.find_one({"_id": ObjectId(analysis_id)})
            if analysis:
                analysis["_id"] = str(analysis["_id"])
            return analysis
        
        except Exception as e:
            logger.error(f"Error retrieving analysis by ID: {str(e)}")
            return None
    
    async def get_analyses_by_email(self, email: str, limit: int = 50) -> List[Dict]:
        """
        Retrieve all analyses for a specific email
        
        Args:
            email: User's email address
            limit: Maximum number of results
            
        Returns:
            List of analysis documents
        """
        try:
            analyses = list(
                self.collection.find({"email": email})
                .sort("timestamp", -1)
                .limit(limit)
            )
            
            # Convert ObjectId to string
            for analysis in analyses:
                analysis["_id"] = str(analysis["_id"])
            
            return analyses
        
        except PyMongoError as e:
            logger.error(f"Error retrieving analyses for email {email}: {str(e)}")
            return []
    
    async def update_analysis(
        self,
        analysis_id: str,
        update_data: Dict[str, Any],
    ) -> bool:
        """
        Update an existing analysis
        
        Args:
            analysis_id: MongoDB ObjectId as string
            update_data: Fields to update
            
        Returns:
            True if updated, False otherwise
        """
        try:
            update_data["updated_at"] = datetime.utcnow()
            result = self.collection.update_one(
                {"_id": ObjectId(analysis_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        
        except Exception as e:
            logger.error(f"Error updating analysis: {str(e)}")
            return False
    
    async def delete_analysis(self, analysis_id: str) -> bool:
        """
        Delete an analysis
        
        Args:
            analysis_id: MongoDB ObjectId as string
            
        Returns:
            True if deleted, False otherwise
        """
        try:
            result = self.collection.delete_one({"_id": ObjectId(analysis_id)})
            return result.deleted_count > 0
        
        except Exception as e:
            logger.error(f"Error deleting analysis: {str(e)}")
            return False
    
    async def get_statistics(self, email: str) -> Dict[str, Any]:
        """
        Get statistics for a user's analyses
        
        Args:
            email: User's email address
            
        Returns:
            Statistics dictionary
        """
        try:
            total = self.collection.count_documents({"email": email})
            latest = self.collection.find_one(
                {"email": email},
                sort=[("timestamp", -1)]
            )
            
            return {
                "total_analyses": total,
                "latest_analysis_date": latest["timestamp"] if latest else None,
                "email": email,
            }
        
        except PyMongoError as e:
            logger.error(f"Error getting statistics: {str(e)}")
            return {
                "total_analyses": 0,
                "latest_analysis_date": None,
                "email": email,
            }


# Singleton instance
form_analysis_db = FormAnalysisDB()

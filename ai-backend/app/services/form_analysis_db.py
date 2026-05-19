"""
MongoDB helper for storing and retrieving form analyses
This mirrors the Node `Analysis` schema and writes to the `form_analyses` collection.
"""
from typing import Optional, Dict, Any, List
import pymongo
from pymongo.collection import Collection
from datetime import datetime
from bson import ObjectId
from app.config.settings import settings


class FormAnalysisDB:
    def __init__(self):
        self.client = pymongo.MongoClient(settings.MONGODB_URI)
        self.db = self.client[settings.DATABASE_NAME]
        self.collection: Collection = self.db.get_collection("form_analyses")

    def save_analysis(self, *, user_id: str, email: str, title: Optional[str], form_data: Dict[str, Any], analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.utcnow()
        doc = {
            "user_id": user_id or "",
            "email": email or "",
            "title": title or f"Analysis {now.date().isoformat()}",
            "form_data": form_data or {},
            "analysis_results": analysis_results or {},
            "created_at": now,
            "updated_at": now,
        }
        result = self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    def get_analyses_by_email(self, email: str) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"email": email}).sort("created_at", -1)
        return list(cursor)

    def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        try:
            oid = ObjectId(analysis_id)
        except Exception:
            return None
        return self.collection.find_one({"_id": oid})


# Singleton
form_analysis_db = FormAnalysisDB()

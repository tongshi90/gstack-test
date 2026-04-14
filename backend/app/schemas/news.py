from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.enums import NewsCategory

class NewsBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    category: NewsCategory
    cover_image: Optional[str] = None
    publish_time: Optional[datetime] = None

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    category: Optional[NewsCategory] = None
    cover_image: Optional[str] = None
    publish_time: Optional[datetime] = None

class NewsResponse(NewsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

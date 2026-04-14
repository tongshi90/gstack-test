from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AnnouncementBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    is_pinned: bool = False
    publish_time: Optional[datetime] = None

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    is_pinned: Optional[bool] = None
    publish_time: Optional[datetime] = None

class AnnouncementResponse(AnnouncementBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

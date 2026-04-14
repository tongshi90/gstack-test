from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy import func
from app.core.database import Base

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_pinned = Column(Boolean, default=False, nullable=False)
    publish_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

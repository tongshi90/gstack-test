from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy import func
from app.core.database import Base

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    cover_image = Column(String(500), nullable=True)
    publish_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.news import News
from app.schemas.news import NewsCreate, NewsUpdate, NewsResponse
from app.enums import NewsCategory
import secrets
import string
from pydantic import BaseModel

router = APIRouter(prefix="/api/news", tags=["news"])

@router.get("/", response_model=dict)
async def get_news_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    query = db.query(News)

    if category:
        query = query.filter(News.category == category)
    if start_date:
        query = query.filter(News.publish_time >= start_date)
    if end_date:
        query = query.filter(News.publish_time <= end_date)

    total = query.count()
    news_list = query.order_by(News.publish_time.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {"data": news_list, "total": total}

@router.get("/categories", response_model=List[str])
async def get_news_categories():
    return NewsCategory.list()

@router.get("/{news_id}", response_model=NewsResponse)
async def get_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="新闻不存在")
    return news

class SuccessResponse(BaseModel):
    success: bool

admin_router = APIRouter(prefix="/api/admin/news", tags=["admin-news"])

@admin_router.post("/", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
async def create_news(news: NewsCreate, db: Session = Depends(get_db)):
    db_news = News(**news.model_dump())
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

@admin_router.put("/{news_id}", response_model=NewsResponse)
async def update_news(news_id: int, news: NewsUpdate, db: Session = Depends(get_db)):
    db_news = db.query(News).filter(News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="新闻不存在")

    update_data = news.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_news, key, value)

    db.commit()
    db.refresh(db_news)
    return db_news

@admin_router.delete("/{news_id}", response_model=SuccessResponse)
async def delete_news(news_id: int, db: Session = Depends(get_db)):
    db_news = db.query(News).filter(News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="新闻不存在")

    db.delete(db_news)
    db.commit()
    return SuccessResponse(success=True)

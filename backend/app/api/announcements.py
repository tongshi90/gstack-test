from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate, AnnouncementResponse
from pydantic import BaseModel

router = APIRouter(prefix="/api/announcements", tags=["announcements"])

@router.get("/", response_model=dict)
async def get_announcements_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Announcement)

    if start_date:
        query = query.filter(Announcement.publish_time >= start_date)
    if end_date:
        query = query.filter(Announcement.publish_time <= end_date)

    query = query.order_by(Announcement.is_pinned.desc(), Announcement.publish_time.desc())

    total = query.count()
    announcements = query.offset((page - 1) * page_size).limit(page_size).all()

    return {"data": announcements, "total": total}

@router.get("/{announcement_id}", response_model=AnnouncementResponse)
async def get_announcement(announcement_id: int, db: Session = Depends(get_db)):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="公告不存在")
    return announcement

class SuccessResponse(BaseModel):
    success: bool

admin_router = APIRouter(prefix="/api/admin/announcements", tags=["admin-announcements"])

@admin_router.post("/", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
async def create_announcement(announcement: AnnouncementCreate, db: Session = Depends(get_db)):
    db_announcement = Announcement(**announcement.model_dump())
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

@admin_router.put("/{announcement_id}", response_model=AnnouncementResponse)
async def update_announcement(announcement_id: int, announcement: AnnouncementUpdate, db: Session = Depends(get_db)):
    db_announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not db_announcement:
        raise HTTPException(status_code=404, detail="公告不存在")

    update_data = announcement.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_announcement, key, value)

    db.commit()
    db.refresh(db_announcement)
    return db_announcement

@admin_router.delete("/{announcement_id}", response_model=SuccessResponse)
async def delete_announcement(announcement_id: int, db: Session = Depends(get_db)):
    db_announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not db_announcement:
        raise HTTPException(status_code=404, detail="公告不存在")

    db.delete(db_announcement)
    db.commit()
    return SuccessResponse(success=True)

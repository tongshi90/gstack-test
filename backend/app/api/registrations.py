from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import secrets
import string
from app.core.database import get_db
from app.models.registration import Registration
from app.schemas.registration import RegistrationCreate, RegistrationDraft, RegistrationUpdate, RegistrationResponse, RegistrationSubmitResponse
from app.services.export_service import export_registrations_to_excel

router = APIRouter(prefix="/api/registrations", tags=["registrations"])

def generate_registration_number() -> str:
    year = datetime.now().year
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(secrets.choice(chars) for _ in range(6))
    return f"{year}{random_part}"

@router.post("/draft", response_model=RegistrationSubmitResponse)
async def save_draft(registration: RegistrationDraft, db: Session = Depends(get_db)):
    existing = db.query(Registration).filter(
        Registration.registration_number == registration.registration_number
    ).first() if registration.registration_number else None

    if existing:
        existing.set_student_info(registration.student.model_dump())
        existing.set_parents_info(registration.parents.model_dump())
        existing.status = "draft"
        db.commit()
        return RegistrationSubmitResponse(registration_number=existing.registration_number)

    registration_number = generate_registration_number()
    db_registration = Registration(
        registration_number=registration_number
    )
    db_registration.set_student_info(registration.student.model_dump())
    db_registration.set_parents_info(registration.parents.model_dump())
    db_registration.status = "draft"

    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)

    return RegistrationSubmitResponse(registration_number=registration_number)

@router.post("/", response_model=RegistrationSubmitResponse)
async def submit_registration(registration: RegistrationCreate, db: Session = Depends(get_db)):
    registration_number = registration.registration_number if registration.registration_number else generate_registration_number()

    existing = db.query(Registration).filter(
        Registration.registration_number == registration_number
    ).first()

    if existing:
        existing.set_student_info(registration.student.model_dump())
        existing.set_parents_info(registration.parents.model_dump())
        existing.status = "submitted"
        db.commit()
        return RegistrationSubmitResponse(registration_number=existing.registration_number)

    db_registration = Registration(
        registration_number=registration_number
    )
    db_registration.set_student_info(registration.student.model_dump())
    db_registration.set_parents_info(registration.parents.model_dump())
    db_registration.status = "submitted"

    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)

    return RegistrationSubmitResponse(registration_number=registration_number)

@router.get("/{registration_number}", response_model=RegistrationResponse)
async def get_registration(registration_number: str, db: Session = Depends(get_db)):
    registration = db.query(Registration).filter(
        Registration.registration_number == registration_number
    ).first()

    if not registration:
        raise HTTPException(status_code=404, detail="报名信息不存在")

    return RegistrationResponse(
        id=registration.id,
        registration_number=registration.registration_number,
        student=registration.get_student_info(),
        parents=registration.get_parents_info(),
        status=registration.status,
        created_at=registration.created_at,
        updated_at=registration.updated_at
    )

@router.put("/{registration_number}", response_model=RegistrationResponse)
async def update_registration(
    registration_number: str,
    registration: RegistrationUpdate,
    db: Session = Depends(get_db)
):
    db_registration = db.query(Registration).filter(
        Registration.registration_number == registration_number
    ).first()

    if not db_registration:
        raise HTTPException(status_code=404, detail="报名信息不存在")

    if registration.student:
        db_registration.set_student_info(registration.student.model_dump())
    if registration.parents:
        db_registration.set_parents_info(registration.parents.model_dump())

    db.commit()
    db.refresh(db_registration)

    return RegistrationResponse(
        id=db_registration.id,
        registration_number=db_registration.registration_number,
        student=db_registration.get_student_info(),
        parents=db_registration.get_parents_info(),
        status=db_registration.status,
        created_at=db_registration.created_at,
        updated_at=db_registration.updated_at
    )

admin_router = APIRouter(prefix="/api/admin/registrations", tags=["admin-registrations"])

@admin_router.get("/", response_model=dict)
async def get_registrations_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    name: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Registration)

    if name:
        query = query.filter(Registration.student_info.like(f'%{name}%'))
    if start_date:
        query = query.filter(Registration.created_at >= start_date)
    if end_date:
        query = query.filter(Registration.created_at <= end_date)

    total = query.count()
    registrations = query.order_by(Registration.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for reg in registrations:
        result.append({
            "id": reg.id,
            "registration_number": reg.registration_number,
            "student": reg.get_student_info(),
            "parents": reg.get_parents_info(),
            "status": reg.status,
            "created_at": reg.created_at,
            "updated_at": reg.updated_at
        })

    return {"data": result, "total": total}

@admin_router.get("/{registration_id}", response_model=RegistrationResponse)
async def get_registration_by_id(registration_id: int, db: Session = Depends(get_db)):
    registration = db.query(Registration).filter(Registration.id == registration_id).first()

    if not registration:
        raise HTTPException(status_code=404, detail="报名信息不存在")

    return RegistrationResponse(
        id=registration.id,
        registration_number=registration.registration_number,
        student=registration.get_student_info(),
        parents=registration.get_parents_info(),
        status=registration.status,
        created_at=registration.created_at,
        updated_at=registration.updated_at
    )

@admin_router.get("/export")
async def export_registrations(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Registration)

    if start_date:
        query = query.filter(Registration.created_at >= start_date)
    if end_date:
        query = query.filter(Registration.created_at <= end_date)

    registrations = query.all()
    return export_registrations_to_excel(registrations)

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from re import match
from app.enums import Gender, RegistrationStatus

class StudentInfo(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    gender: Gender
    birth_date: datetime
    id_card: str = Field(..., min_length=15, max_length=18)
    address: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=11, max_length=11)

    @field_validator('id_card')
    @classmethod
    def validate_id_card(cls, v: str) -> str:
        if not match(r'^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$', v):
            raise ValueError('身份证号格式不正确')
        return v

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not match(r'^1[3-9]\d{9}$', v):
            raise ValueError('手机号格式不正确')
        return v

class ParentInfo(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    phone: str = Field(..., min_length=11, max_length=11)
    work_unit: str | None = Field(None, max_length=100)

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not match(r'^1[3-9]\d{9}$', v):
            raise ValueError('手机号格式不正确')
        return v

class ParentsInfo(BaseModel):
    father: ParentInfo
    mother: ParentInfo

class RegistrationBase(BaseModel):
    student: StudentInfo
    parents: ParentsInfo
    status: RegistrationStatus = RegistrationStatus.DRAFT

class RegistrationCreate(RegistrationBase):
    registration_number: str | None = None

class RegistrationDraft(BaseModel):
    registration_number: str | None = None
    student: StudentInfo
    parents: ParentsInfo

class RegistrationUpdate(BaseModel):
    student: StudentInfo | None = None
    parents: ParentsInfo | None = None

class RegistrationResponse(BaseModel):
    id: int
    registration_number: str
    student: StudentInfo
    parents: ParentsInfo
    status: RegistrationStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RegistrationSubmitResponse(BaseModel):
    registration_number: str

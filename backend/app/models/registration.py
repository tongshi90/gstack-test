import json
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy import func
from app.core.database import Base

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    registration_number = Column(String(50), unique=True, index=True, nullable=False)
    student_info = Column(String(5000), nullable=False)
    parents_info = Column(String(5000), nullable=False)
    status = Column(String(20), default="draft", nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def get_student_info(self):
        return json.loads(self.student_info)

    def set_student_info(self, info: dict):
        self.student_info = json.dumps(info, ensure_ascii=False)

    def get_parents_info(self):
        return json.loads(self.parents_info)

    def set_parents_info(self, info: dict):
        self.parents_info = json.dumps(info, ensure_ascii=False)

from enum import Enum

class NewsCategory(str, Enum):
    SCHOOL_INTRO = "SCHOOL_INTRO"
    CAMPUS_NEWS = "CAMPUS_NEWS"
    EXCELLENT_TEACHERS_STUDENTS = "EXCELLENT_TEACHERS_STUDENTS"

    @classmethod
    def list(cls):
        return [member.value for member in cls]

class RegistrationStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"

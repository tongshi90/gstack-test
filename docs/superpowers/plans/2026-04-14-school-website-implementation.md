# XX中学官方网站实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个完整的中学官方网站，包含前台信息展示、在线报名系统和后台管理功能

**Architecture:** 前后端分离架构，前端使用 React + Ant Design，后端使用 Python FastAPI + SQLite，通过 RESTful API 通信，使用 Docker Compose 进行容器化部署

**Tech Stack:** React 18, TypeScript, Vite, Ant Design, Python 3.10+, FastAPI, SQLAlchemy, SQLite, Docker

---

## 文件结构规划

### 后端文件结构
```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── news.py              # 新闻相关 API
│   │   ├── announcements.py      # 公告相关 API
│   │   └── registrations.py      # 报名相关 API
│   ├── models/
│   │   ├── __init__.py
│   │   ├── news.py             # 新闻模型
│   │   ├── announcement.py      # 公告模型
│   │   └── registration.py      # 报名模型
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── news.py             # 新闻 Schema
│   │   ├── announcement.py      # 公告 Schema
│   │   └── registration.py      # 报名 Schema
│   ├── services/
│   │   ├── __init__.py
│   │   └── export_service.py   # Excel 导出服务
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── error_handler.py    # 错误处理中间件
│   │   └── logger.py           # 日志中间件
│   ├── core/
│   │   ├── __init__.py
│   │   ├── database.py         # 数据库配置
│   │   └── config.py           # 应用配置
│   ├── main.py                 # FastAPI 应用入口
│   └── enums.py                # 枚举定义
├── tests/
│   ├── __init__.py
│   ├── test_news.py
│   ├── test_announcements.py
│   └── test_registrations.py
├── requirements.txt
├── pyproject.toml
└── Dockerfile
```

### 前端文件结构
```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Pagination.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── SchoolIntro.tsx
│   │   ├── News/
│   │   │   ├── List.tsx
│   │   │   └── Detail.tsx
│   │   ├── Announcements/
│   │   │   ├── List.tsx
│   │   │   └── Detail.tsx
│   │   ├── Registration/
│   │   │   ├── Form.tsx
│   │   │   └── Success.tsx
│   │   ├── Notice.tsx
│   │   ├── Contact.tsx
│   │   └── Admin/
│   │       ├── Layout.tsx
│   │       ├── News/
│   │       ├── Announcements/
│   │       └── Registrations/
│   ├── services/
│   │   ├── news.ts
│   │   ├── announcements.ts
│   │   └── registrations.ts
│   ├── hooks/
│   │   └── useApi.ts
│   ├── utils/
│   │   └── validators.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

---

## 第一阶段：后端基础架构搭建

### Task 1: 初始化后端项目结构

**Files:**
- Create: `backend/app/__init__.py`
- Create: `backend/requirements.txt`
- Create: `backend/pyproject.toml`
- Create: `backend/Dockerfile`
- Create: `docker-compose.yml`

- [ ] **Step 1: 创建后端目录结构和空文件**

```bash
cd backend
mkdir -p app/api app/models app/schemas app/services app/middleware app/core tests
touch app/__init__.py app/api/__init__.py app/models/__init__.py app/schemas/__init__.py
touch app/services/__init__.py app/middleware/__init__.py app/core/__init__.py
touch tests/__init__.py
```

- [ ] **Step 2: 创建 requirements.txt**

```text
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
pydantic-settings==2.1.0
openpyxl==3.1.2
python-multipart==0.0.6
```

- [ ] **Step 3: 创建 pyproject.toml**

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
python_classes = "Test*"
python_functions = "test_*"
```

- [ ] **Step 4: 创建 Dockerfile**

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

ENV DATABASE_URL=sqlite:///data/school.db

RUN mkdir -p data

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8084"]
```

- [ ] **Step 5: 创建根目录 docker-compose.yml**

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8084:8084"
    volumes:
      - ./backend/data:/app/data
    environment:
      - DATABASE_URL=sqlite:///data/school.db

  frontend:
    build: ./frontend
    ports:
      - "8083:80"
    depends_on:
      - backend
```

- [ ] **Step 6: 提交**

```bash
git add backend/ docker-compose.yml
git commit -m "feat: 初始化后端项目结构和 Docker 配置"
```

---

### Task 2: 创建数据库配置和连接

**Files:**
- Create: `backend/app/core/config.py`
- Create: `backend/app/core/database.py`

- [ ] **Step 1: 创建配置文件**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///data/school.db"
    port: int = 8084
    
    class Config:
        env_file = ".env"

settings = Settings()
```

- [ ] **Step 2: 创建数据库配置文件**

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.database_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

- [ ] **Step 3: 测试数据库连接**

```python
import pytest
from app.core.database import engine, get_db

def test_database_connection():
    try:
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            assert result.fetchone()[0] == 1
    except Exception as e:
        pytest.fail(f"数据库连接失败: {e}")
```

- [ ] **Step 4: 运行测试**

```bash
cd backend
pytest tests/test_database.py -v
```

- [ ] **Step 5: 提交**

```bash
git add backend/app/core/
git commit -m "feat: 创建数据库配置和连接"
```

---

### Task 3: 创建枚举定义和基础模型

**Files:**
- Create: `backend/app/enums.py`
- Create: `backend/app/models/news.py`
- Create: `backend/app/models/announcement.py`
- Create: `backend/app/models/registration.py`

- [ ] **Step 1: 创建枚举定义**

```python
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
```

- [ ] **Step 2: 创建新闻模型**

```python
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
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
```

- [ ] **Step 3: 创建公告模型**

```python
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
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
```

- [ ] **Step 4: 创建报名模型**

```python
import json
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
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
```

- [ ] **Step 5: 测试模型创建**

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.news import News
from app.models.announcement import Announcement
from app.models.registration import Registration
from app.core.database import Base

def test_create_tables():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    
    inspector = engine.dialect.get_inspector(engine)
    tables = inspector.get_table_names()
    
    assert "news" in tables
    assert "announcements" in tables
    assert "registrations" in tables
```

- [ ] **Step 6: 运行测试**

```bash
cd backend
pytest tests/test_models.py -v
```

- [ ] **Step 7: 提交**

```bash
git add backend/app/enums.py backend/app/models/
git commit -m "feat: 创建数据模型和枚举定义"
```

---

### Task 4: 创建 Pydantic Schemas

**Files:**
- Create: `backend/app/schemas/news.py`
- Create: `backend/app/schemas/announcement.py`
- Create: `backend/app/schemas/registration.py`

- [ ] **Step 1: 创建新闻 Schema**

```python
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
```

- [ ] **Step 2: 创建公告 Schema**

```python
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
```

- [ ] **Step 3: 创建报名 Schema**

```python
from pydantic import BaseModel, Field, validator
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
    
    @validator('id_card')
    def validate_id_card(cls, v):
        if not match(r'^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$', v):
            raise ValueError('身份证号格式不正确')
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        if not match(r'^1[3-9]\d{9}$', v):
            raise ValueError('手机号格式不正确')
        return v

class ParentInfo(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    phone: str = Field(..., min_length=11, max_length=11)
    work_unit: Optional[str] = Field(None, max_length=100)
    
    @validator('phone')
    def validate_phone(cls, v):
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
    registration_number: Optional[str] = None

class RegistrationDraft(BaseModel):
    registration_number: Optional[str] = None
    student: StudentInfo
    parents: ParentsInfo

class RegistrationUpdate(BaseModel):
    student: Optional[StudentInfo] = None
    parents: Optional[ParentsInfo] = None

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
```

- [ ] **Step 4: 测试 Schema 验证**

```python
import pytest
from pydantic import ValidationError
from app.schemas.news import NewsCreate, NewsCategory
from app.schemas.registration import StudentInfo, ParentInfo, ParentsInfo, RegistrationCreate
from datetime import datetime

def test_news_create_valid():
    news = NewsCreate(
        title="测试新闻",
        content="新闻内容",
        category=NewsCategory.SCHOOL_INTRO
    )
    assert news.title == "测试新闻"

def test_news_create_invalid_title():
    with pytest.raises(ValidationError):
        NewsCreate(
            title="",
            content="内容",
            category=NewsCategory.SCHOOL_INTRO
        )

def test_student_info_valid_id_card():
    student = StudentInfo(
        name="张三",
        gender="male",
        birth_date=datetime.now(),
        id_card="110101199001011234",
        address="北京市",
        phone="13800138000"
    )
    assert student.id_card == "110101199001011234"

def test_student_info_invalid_id_card():
    with pytest.raises(ValidationError):
        StudentInfo(
            name="张三",
            gender="male",
            birth_date=datetime.now(),
            id_card="123456",
            address="北京市",
            phone="13800138000"
        )
```

- [ ] **Step 5: 运行测试**

```bash
cd backend
pytest tests/test_schemas.py -v
```

- [ ] **Step 6: 提交**

```bash
git add backend/app/schemas/
git commit -m "feat: 创建 Pydantic Schemas 和验证规则"
```

---

### Task 5: 创建错误处理和日志中间件

**Files:**
- Create: `backend/app/middleware/error_handler.py`
- Create: `backend/app/middleware/logger.py`

- [ ] **Step 1: 创建错误处理中间件**

```python
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
import logging

logger = logging.getLogger(__name__)

class AppException(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message

async def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"Application error: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body}
    )

async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "服务器内部错误"}
    )
```

- [ ] **Step 2: 创建日志配置**

```python
import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
```

- [ ] **Step 3: 测试错误处理**

```python
import pytest
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from app.middleware.error_handler import AppException, app_exception_handler, general_exception_handler

def test_app_exception_handler():
    app = FastAPI()
    app.add_exception_handler(AppException, app_exception_handler)
    
    @app.get("/test-error")
    async def test_error():
        raise AppException(status_code=400, message="测试错误")
    
    client = TestClient(app)
    response = client.get("/test-error")
    
    assert response.status_code == 400
    assert response.json() == {"detail": "测试错误"}

def test_general_exception_handler():
    app = FastAPI()
    app.add_exception_handler(Exception, general_exception_handler)
    
    @app.get("/test-general-error")
    async def test_general_error():
        raise Exception("未知错误")
    
    client = TestClient(app)
    response = client.get("/test-general-error")
    
    assert response.status_code == 500
    assert "detail" in response.json()
```

- [ ] **Step 4: 运行测试**

```bash
cd backend
pytest tests/test_middleware.py -v
```

- [ ] **Step 5: 提交**

```bash
git add backend/app/middleware/
git commit -m "feat: 创建错误处理和日志中间件"
```

---

### Task 6: 创建 FastAPI 主应用

**Files:**
- Create: `backend/app/main.py`

- [ ] **Step 1: 创建主应用文件**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.middleware.logger import setup_logging
from app.middleware.error_handler import AppException, app_exception_handler, validation_exception_handler, general_exception_handler
from fastapi.exceptions import RequestValidationError

setup_logging()

app = FastAPI(title="XX中学官方网站 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

@app.get("/")
async def root():
    return {"message": "XX中学官方网站 API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

- [ ] **Step 2: 测试主应用启动**

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_root_endpoint():
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "XX中学官方网站 API"}

def test_health_check():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
```

- [ ] **Step 3: 运行测试**

```bash
cd backend
pytest tests/test_main.py -v
```

- [ ] **Step 4: 提交**

```bash
git add backend/app/main.py
git commit -m "feat: 创建 FastAPI 主应用"
```

---

### Task 7: 创建新闻相关 API

**Files:**
- Create: `backend/app/api/news.py`

- [ ] **Step 1: 创建新闻 API**

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.news import News
from app.schemas.news import NewsCreate, NewsUpdate, NewsResponse
from app.enums import NewsCategory
import secrets
import string

router = APIRouter(prefix="/api/news", tags=["news"])

def generate_registration_number():
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(10))

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
```

- [ ] **Step 2: 测试新闻 API**

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.models.news import News
from app.core.database import Base
from datetime import datetime

engine = create_engine("sqlite:///:memory:")
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def test_get_news_categories():
    client = TestClient(app)
    response = client.get("/api/news/categories")
    assert response.status_code == 200
    categories = response.json()
    assert "SCHOOL_INTRO" in categories
    assert "CAMPUS_NEWS" in categories
    assert "EXCELLENT_TEACHERS_STUDENTS" in categories
```

- [ ] **Step 3: 运行测试**

```bash
cd backend
pytest tests/test_news_api.py -v
```

- [ ] **Step 4: 提交**

```bash
git add backend/app/api/news.py
git commit -m "feat: 创建新闻查询 API"
```

---

### Task 8: 创建新闻管理 API（后台）

**Files:**
- Modify: `backend/app/api/news.py`

- [ ] **Step 1: 添加后台管理 API**

```python
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.news import News
from app.schemas.news import NewsCreate, NewsUpdate, NewsResponse
from app.enums import NewsCategory
from pydantic import BaseModel

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
```

- [ ] **Step 2: 更新 main.py 包含管理路由**

```python
from app.api.news import router as news_router, admin_router as admin_news_router

app.include_router(news_router)
app.include_router(admin_news_router)
```

- [ ] **Step 3: 测试管理 API**

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_create_news():
    client = TestClient(app)
    news_data = {
        "title": "测试新闻",
        "content": "新闻内容",
        "category": "SCHOOL_INTRO"
    }
    
    response = client.post("/api/admin/news/", json=news_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "测试新闻"
    assert "id" in data

def test_update_news():
    client = TestClient(app)
    news_data = {
        "title": "测试新闻",
        "content": "新闻内容",
        "category": "SCHOOL_INTRO"
    }
    
    create_response = client.post("/api/admin/news/", json=news_data)
    news_id = create_response.json()["id"]
    
    update_data = {"title": "更新后的标题"}
    update_response = client.put(f"/api/admin/news/{news_id}", json=update_data)
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "更新后的标题"

def test_delete_news():
    client = TestClient(app)
    news_data = {
        "title": "测试新闻",
        "content": "新闻内容",
        "category": "SCHOOL_INTRO"
    }
    
    create_response = client.post("/api/admin/news/", json=news_data)
    news_id = create_response.json()["id"]
    
    delete_response = client.delete(f"/api/admin/news/{news_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["success"] == True
```

- [ ] **Step 4: 运行测试**

```bash
cd backend
pytest tests/test_admin_news_api.py -v
```

- [ ] **Step 5: 提交**

```bash
git add backend/app/api/news.py backend/app/main.py
git commit -m "feat: 创建新闻管理 API（CRUD）"
```

---

## 第二阶段：公告和报名 API

### Task 9: 创建公告相关 API

**Files:**
- Create: `backend/app/api/announcements.py`

- [ ] **Step 1: 创建公告 API**

```python
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate, AnnouncementResponse
from pydantic import BaseModel

class SuccessResponse(BaseModel):
    success: bool

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
```

- [ ] **Step 2: 更新 main.py 包含公告路由**

```python
from app.api.announcements import router as announcements_router, admin_router as admin_announcements_router

app.include_router(announcements_router)
app.include_router(admin_announcements_router)
```

- [ ] **Step 3: 测试公告 API**

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_create_announcement():
    client = TestClient(app)
    announcement_data = {
        "title": "测试公告",
        "content": "公告内容",
        "is_pinned": True
    }
    
    response = client.post("/api/admin/announcements/", json=announcement_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "测试公告"
    assert data["is_pinned"] == True

def test_get_announcements_with_pinning():
    client = TestClient(app)
    
    pinned_data = {"title": "置顶公告", "content": "内容", "is_pinned": True}
    regular_data = {"title": "普通公告", "content": "内容", "is_pinned": False}
    
    client.post("/api/admin/announcements/", json=pinned_data)
    client.post("/api/admin/announcements/", json=regular_data)
    
    response = client.get("/api/announcements/")
    assert response.status_code == 200
    announcements = response.json()["data"]
    
    if len(announcements) >= 2:
        assert announcements[0]["is_pinned"] == True
```

- [ ] **Step 4: 运行测试**

```bash
cd backend
pytest tests/test_announcements_api.py -v
```

- [ ] **Step 5: 提交**

```bash
git add backend/app/api/announcements.py backend/app/main.py
git commit -m "feat: 创建公告相关 API"
```

---

### Task 10: 创建报名相关 API

**Files:**
- Create: `backend/app/api/registrations.py`
- Create: `backend/app/services/export_service.py`

- [ ] **Step 1: 创建 Excel 导出服务**

```python
from fastapi import Response
from openpyxl import Workbook
from io import BytesIO
from typing import List
from app.models.registration import Registration

def export_registrations_to_excel(registrations: List[Registration]) -> Response:
    wb = Workbook()
    ws = wb.active
    ws.title = "报名信息"
    
    headers = ["报名号", "学生姓名", "性别", "出生日期", "身份证号", "家庭住址", "联系电话",
                "父亲姓名", "父亲电话", "父亲工作单位", "母亲姓名", "母亲电话", "母亲工作单位", "状态", "提交时间"]
    
    ws.append(headers)
    
    for reg in registrations:
        student = reg.get_student_info()
        parents = reg.get_parents_info()
        
        row = [
            reg.registration_number,
            student["name"],
            student["gender"],
            student["birth_date"],
            student["id_card"],
            student["address"],
            student["phone"],
            parents["father"]["name"],
            parents["father"]["phone"],
            parents["father"].get("work_unit", ""),
            parents["mother"]["name"],
            parents["mother"]["phone"],
            parents["mother"].get("work_unit", ""),
            reg.status,
            reg.created_at.strftime("%Y-%m-%d %H:%M:%S") if reg.created_at else ""
        ]
        ws.append(row)
    
    output = BytesIO()
    wb.save(output)
    output.seek(0)
    
    return Response(
        content=output.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=registrations.xlsx"}
    )
```

- [ ] **Step 2: 创建报名 API**

```python
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
```

- [ ] **Step 3: 更新 main.py 包含报名路由**

```python
from app.api.registrations import router as registrations_router, admin_router as admin_registrations_router

app.include_router(registrations_router)
app.include_router(admin_registrations_router)
```

- [ ] **Step 4: 测试报名 API**

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_save_draft():
    client = TestClient(app)
    draft_data = {
        "student": {
            "name": "张三",
            "gender": "male",
            "birth_date": "2010-01-01T00:00:00",
            "id_card": "110101201001011234",
            "address": "北京市",
            "phone": "13800138000"
        },
        "parents": {
            "father": {
                "name": "父亲",
                "phone": "13900139000"
            },
            "mother": {
                "name": "母亲",
                "phone": "13700137000"
            }
        }
    }
    
    response = client.post("/api/registrations/draft", json=draft_data)
    assert response.status_code == 200
    assert "registration_number" in response.json()

def test_submit_registration():
    client = TestClient(app)
    registration_data = {
        "student": {
            "name": "李四",
            "gender": "female",
            "birth_date": "2010-02-01T00:00:00",
            "id_card": "110101201002011234",
            "address": "上海市",
            "phone": "13800138001"
        },
        "parents": {
            "father": {
                "name": "父亲",
                "phone": "13900139001"
            },
            "mother": {
                "name": "母亲",
                "phone": "13700137001"
            }
        }
    }
    
    response = client.post("/api/registrations/", json=registration_data)
    assert response.status_code == 200
    assert "registration_number" in response.json()
    
    registration_number = response.json()["registration_number"]
    get_response = client.get(f"/api/registrations/{registration_number}")
    assert get_response.status_code == 200
    assert get_response.json()["status"] == "submitted"

def test_invalid_id_card():
    client = TestClient(app)
    invalid_data = {
        "student": {
            "name": "王五",
            "gender": "male",
            "birth_date": "2010-03-01T00:00:00",
            "id_card": "123456",
            "address": "广州市",
            "phone": "13800138002"
        },
        "parents": {
            "father": {
                "name": "父亲",
                "phone": "13900139002"
            },
            "mother": {
                "name": "母亲",
                "phone": "13700137002"
            }
        }
    }
    
    response = client.post("/api/registrations/", json=invalid_data)
    assert response.status_code == 422
```

- [ ] **Step 5: 运行测试**

```bash
cd backend
pytest tests/test_registrations_api.py -v
```

- [ ] **Step 6: 提交**

```bash
git add backend/app/api/registrations.py backend/app/services/export_service.py backend/app/main.py
git commit -m "feat: 创建报名相关 API 和 Excel 导出功能"
```

---

## 第三阶段：前端基础架构

### Task 11: 初始化前端项目

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/index.html`
- Create: `frontend/Dockerfile`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "school-website-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "antd": "^5.12.0",
    "axios": "^1.6.2",
    "@ant-design/icons": "^5.2.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8083,
    proxy: {
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      }
    }
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 tsconfig.node.json**

```需要的额外配置文件

[ ] **Step 5: 创建 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/v" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XX中学官方网站</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 Dockerfile**

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 7: 创建 nginx.conf**

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8084;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

- [ ] **Step 8: 提交**

```bash
git add frontend/
git commit -m "feat: 初始化前端项目配置"
```

---

### Task 12: 创建前端基础结构和类型定义

**Files:**
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/router.tsx`

- [ ] **Step 1: 创建类型定义**

```typescript
export interface News {
  id: number;
  title: string;
  content: string;
  category: 'SCHOOL_INTRO' | 'CAMPUS_NEWS' | 'EXCELLENT_TEACHERS_STUDENTS';
  coverImage?: string;
  publishTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  publishTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentInfo {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  idCard: string;
  address: string;
  phone: string;
}

export interface ParentInfo {
  name: string;
  phone: string;
  workUnit?: string;
}

export interface ParentsInfo {
  father: ParentInfo;
  mother: ParentInfo;
}

export interface Registration {
  id: number;
  registrationNumber: string;
  student: StudentInfo;
  parents: ParentsInfo;
  status: 'draft' | 'submitted';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
}

export type NewsCategory = 'SCHOOL_INTRO' | 'CAMPUS_NEWS' | 'EXCELLENT_TEACHERS_STUDENTS';
export const NEWS_CATEGORIES: readonly NewsCategory[] = ['SCHOOL_INTRO', 'CAMPUS_NEWS', 'EXCELLENT_TEACHERS_STUDENTS'] as const;

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  SCHOOL_INTRO: '学校简介',
  CAMPUS_NEWS: '校园动态',
  EXCELLENT_TEACHERS_STUDENTS: '优秀师生',
};
```

- [ ] **Step 2: 创建路由配置**

```typescript
import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import SchoolIntro from '@/pages/SchoolIntro';
import NewsList from '@/pages/News/List';
import NewsDetail from '@/pages/News/Detail';
import AnnouncementsList from '@/pages/Announcements/List';
import AnnouncementsDetail from '@/pages/Announcements/Detail';
import RegistrationForm from '@/pages/Registration/Form';
import RegistrationSuccess from '@/pages/Registration/Success';
import Notice from '@/pages/Notice';
import Contact from '@/pages/Contact';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/school-intro',
    element: <SchoolIntro />,
  },
  {
    path: '/news',
    element: <NewsList />,
  },
  {
    path: '/news/:id',
    element: <NewsDetail />,
  },
  {
    path: '/announcements',
    element: <AnnouncementsList />,
  },
  {
    path: '/announcements/:id',
    element: <AnnouncementsDetail />,
  },
  {
    path: '/registration',
    element: <RegistrationForm />,
  },
  {
    path: '/registration/success',
    element: <RegistrationSuccess />,
  },
  {
    path: '/notice',
    element: <Notice />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
]);

export default router;
```

- [ ] **Step 3: 创建 main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import router from './router'
import { RouterProvider } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
)
```

- [ ] **Step 4: 创建 App.tsx**

```typescript
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
```

- [ ] **Step 5: 提交**

```bash
git add frontend/src/
git commit -m "feat: 创建前端基础结构和类型定义"
```

---

### Task 13: 创建公共组件

**Files:**
- Create: `frontend/src/components/Header.tsx`
- Create: `frontend/src/components/Footer.tsx`
- Create: `frontend/src/components/Pagination.tsx`

- [ ] **Step 1: 创建页头组件**

```typescript
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import { HomeOutlined, ReadOutlined, NotificationOutlined, FormOutlined, InfoCircleOutlined } from '@ant-design/icons'

const Header = () => {
  const location = useLocation()
  
  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
    { key: '/school-intro', icon: <InfoCircleOutlined />, label: <Link to="/school-intro">学校介绍</Link> },
    { key: '/news', icon: <ReadOutlined />, label: <Link to="/news">新闻中心</Link> },
    { key: '/announcements', icon: <NotificationOutlined />, label: <Link to="/announcements">通知公告</Link> },
    { key: '/registration', icon: <FormOutlined />, label: <Link to="/registration">在线报名</Link> },
  ]
  
  const getSelectedKey = () => {
    if (location.pathname.startsWith('/news')) return '/news'
    if (location.pathname.startsWith('/announcements')) return '/announcements'
    if (location.pathname.startsWith('/registration')) return '/registration'
    return location.pathname
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">XX中学</Link>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          className="header-menu"
        />
      </div>
    </header>
  )
}

export default Header
```

- [ ] **Step 2: 创建页脚组件**

```typescript
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>关于我们</h3>
          <Link to="/school-intro">学校介绍</Link>
          <Link to="/notice">报名须知</Link>
        </div>
        <div className="footer-section">
          <h3>联系方式</h3>
          <p>地址：XX省XX市XX区XX路XX号</p>
          <p>电话：010-12345678</p>
          <p>邮箱：info@school.edu.cn</p>
        </div>
        <div className="footer-section">
          <h3>快速链接</h3>
          <Link to="/news">新闻中心</Link>
          <Link to="/announcements">通知公告</Link>
          <Link to="/registration">在线报名</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 XX中学 版权所有</p>
      </div>
    </footer>
  )
}

export default Footer
```

- [ ] **Step 3: 创建分页组件**

```typescript
import { Pagination as AntPagination } from 'antd'

interface PaginationProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

const Pagination = ({ current, pageSize, total, onChange }: PaginationProps) => {
  return (
    <div className="pagination-container">
      <AntPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        showQuickJumper
        showTotal={(total) => `共 ${total} 条`}
      />
    </div>
  )
}

export default Pagination
```

- [ ] **Step 4: 提交**

```bash
git add frontend/src/components/
git commit -m "feat: 创建页头、页脚和分页组件"
```

---

### Task 14: 创建 API 服务

**Files:**
- Create: `frontend/src/services/news.ts`
- Create: `frontend/src/services/announcements.ts`
- Create: `frontend/src/services/registrations.ts`
- Create: `frontend/src/services/index.ts`

- [ ] **Step 1: 创建新闻服务**

```typescript
import axios from 'axios'
import type { News, PaginationResponse, NewsCategory } from '@/types'

const API_BASE = '/api'

export const newsService = {
  async getNewsList(params: {
    page?: number
    pageSize?: number
    category?: NewsCategory
    startDate?: string
    endDate?: string
  } = {}): Promise<PaginationResponse<News>> {
    const response = await axios.get<PaginationResponse<News>>(`${API_BASE}/news`, { params })
    return response.data
  },

  async getNewsById(id: number): Promise<News> {
    const response = await axios.get<News>(`${API_BASE}/news/${id}`)
    return response.data
  },

  async getNewsCategories(): Promise<NewsCategory[]> {
    const response = await axios.get<NewsCategory[]>(`${API_BASE}/news/categories`)
    return response.data
  },
}
```

- [ ] **Step 2: 创建公告服务**

```typescript
import axios from 'axios'
import type { Announcement, PaginationResponse } from '@/types'

const API_BASE = '/api'

export const announcementService = {
  async getAnnouncementsList(params: {
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
  } = {}): Promise<PaginationResponse<Announcement>> {
    const response = await axios.get<PaginationResponse<Announcement>>(`${API_BASE}/announcements`, { params })
    return response.data
  },

  async getAnnouncementById(id: number): Promise<Announcement> {
    const response = await axios.get<Announcement>(`${API_BASE}/announcements/${id}`)
    return response.data
  },
}
```

- [ ] **Step 3: 创建报名服务**

```typescript
import axios from 'axios'
import type { Registration, StudentInfo, ParentsInfo } from '@/types'

const API_BASE = '/api'

export const registrationService = {
  async saveDraft(data: {
    registrationNumber?: string
    student: StudentInfo
    parents: ParentsInfo
  }): Promise<{ registrationNumber: string }> {
    const response = await axios.post(`${API_BASE}/registrations/draft`, data)
    return response.data
  },

  async submitRegistration(data: {
    registrationNumber?: string
    student: StudentInfo
    parents: ParentsInfo
  }): Promise<{ registrationNumber: string }> {
    const response = await axios.post(`${API_BASE}/registrations`, data)
    return response.data
  },

  async getRegistration(registrationNumber: string): Promise<Registration> {
    const response = await axios.get<Registration>(`${API_BASE}/registrations/${registrationNumber}`)
    return response.data
  },

  async updateRegistration(
    registrationNumber: string,
    data: {
      student?: StudentInfo
      parents?: ParentsInfo
    }
  ): Promise<Registration> {
    const response = await axios.put<Registration>(`${API_BASE}/registrations/${registrationNumber}`, data)
    return response.data
  },
}
```

- [ ] **Step 4: 创建服务索引文件**

```typescript
export { newsService } from './news'
export { announcementService } from './announcements'
export { registrationService } from './registrations'
```

- [ ] **Step 5: 提交**

```bash
git add frontend/src/services/
git commit -m "feat: 创建 API 服务层"
```

---

## 第四阶段：前台页面实现

### Task 15: 创建首页和学校介绍页面

**Files:**
- Create: `frontend/src/pages/Home.tsx`
- Create: `frontend/src/pages/SchoolIntro.tsx`
- Create: `frontend/src/pages/Notice.tsx`
- Create: `frontend/src/pages/Contact.tsx`

- [ ] **Step 1: 创建首页**

```typescript
import { useEffect, useState } from 'react'
import { Card, Row, Col, List, Button } from 'antd'
import { Link } from 'react-router-dom'
import { RightOutlined } from '@ant-design/icons'
import { newsService, announcementService } from '@/services'
import type { News, Announcement } from '@/types'

const Home = () => {
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsResponse = await newsService.getNewsList({ page: 1, pageSize: 4 })
        setLatestNews(newsResponse.data)
        
        const announcementResponse = await announcementService.getAnnouncementsList({ page: 1, pageSize: 5 })
        setPinnedAnnouncements(announcementResponse.data.filter(a => a.isPinned))
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>欢迎来到XX中学</h1>
          <p>培养德智体美劳全面发展的新时代人才</p>
          <Link to="/registration">
            <Button type="primary" size="large">
              立即报名
            </Button>
          </Link>
        </div>
      </section>

      <Row gutter={24} className="content-row">
        <Col xs={24} md={16}>
          <Card title="最新新闻" extra={<Link to="/news">更多 <RightOutlined /></Link>}>
            <List
              dataSource={latestNews}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news/${item.id}`}>
                    <List.Item.Meta
                      title={item.title}
                      description={new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    />
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title="重要公告">
            <List
              dataSource={pinnedAnnouncements}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/announcements/${item.id}`}>
                    <List.Item.Meta title={item.title} />
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
```

- [ ] **Step 2: 创建学校介绍页面**

```typescript
import { Card, Row, Col, Image } from 'antd'

const SchoolIntro = () => {
  return (
    <div className="school-intro-page">
      <Card title="学校简介">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="intro-text">
              <h3>学校概况</h3>
              <p>
                XX中学创建于XXXX年，是一所具有悠久历史和优良传统的现代化中学。
                学校占地面积XX平方米，现有教学班XX个，在校学生XX人，教职工XX人。
              </p>
              <p>
                学校秉承"XXXX"的办学理念，致力于培养德智体美劳全面发展的新时代人才。
              </p>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="campus-images">
              <h3>校园风光</h3>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <div className="image-placeholder">教学楼</div>
                </Col>
                <Col span={12}>
                  <div className="image-placeholder">操场</div>
                </Col>
                <Col span={12}>
                  <div className="image-placeholder">图书馆</div>
                </Col>
                <Col span={12}>
                  <div className="image-placeholder">体育馆</div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="师资力量" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p>
              学校拥有一支高素质的教师队伍，其中特级教师XX人，高级教师XX人，一级教师XX人。
              教师学历达标率100%，硕士研究生及以上学历教师占比XX%。
            </p>
            <p>
              学校注重教师专业发展，定期组织教研活动和培训，不断提高教师教育教学水平。
            </p>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default SchoolIntro
```

- [ ] **Step 3: 创建报名须知页面**

```typescript
import { Card, List, Typography } from 'antd'

const { Title, Paragraph } = Typography

const Notice = () => {
  const steps = [
    '登录学校官网，点击"在线报名"进入报名系统',
    '阅读报名须知，准备相关材料',
    '填写学生基本信息',
    '填写父母/监护人信息',
    '确认信息无误后提交',
    '保存报名号，等待学校通知'
  ]

  const materials = [
    '学生身份证原件及复印件',
    '户口本原件及复印件',
    '学生近期一寸免冠照片X张',
    '父母/监护人身份证复印件',
    '其他相关证明材料'
  ]

  return (
    <div className="notice-page">
      <Card title="报名须知">
        <Title level={3}>报名流程</Title>
        <List
          dataSource={steps}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<div className="step-number">{index + 1}</div>}
                description={item}
              />
            </List.Item>
          )}
          style={{ marginBottom: 32 }}
        />

        <Title level={3}>所需材料</Title>
        <List
          dataSource={materials}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta description={item} />
            </List.Item>
          )}
        />

        <Title level={3}>联系方式</Title>
        <Paragraph>
          如有疑问，请联系招生办公室：<br />
          电话：010-12345678<br />
          邮箱：admissions@school.edu.cn
        </Paragraph>
      </Card>
    </div>
  )
}

export default Notice
```

- [ ] **Step 4: 创建联系我们页面**

```typescript
import { Card, Descriptions } from 'antd'

const Contact = () => {
  return (
    <div className="contact-page">
      <Card title="联系我们">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="学校名称">XX中学</Descriptions.Item>
          <Descriptions.Item label="学校地址">XX省XX市XX区XX路XX号</Descriptions.Item>
          <Descriptions.Item label="邮政编码">XXXXXX</Descriptions.Item>
          <Descriptions.Item label="联系电话">010-12345678</Descriptions.Item>
          <Descriptions.Item label="招生办电话">010-87654321</Descriptions.Item>
          <Descriptions.Item label="电子邮箱">info@school.edu.cn</Descriptions.Item>
          <Descriptions.Item label="招生办邮箱">admissions@school.edu.cn</Descriptions.Item>
          <Descriptions.Item label="学校官网">www.school.edu.cn</Descriptions.Item>
        </Descriptions>
        
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ width: '100%', height: 300, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            地图位置（待接入）
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Contact
```

- [ ] **Step 5: 提交**

```bash
git add frontend/src/pages/Home.tsx frontend/src/pages/SchoolIntro.tsx frontend/src/pages/Notice.tsx frontend/src/pages/Contact.tsx
git commit -m "feat: 创建首页、学校介绍、报名须知和联系我们页面"
```

---

### Task 16: 创建新闻相关页面

**Files:**
- Create: `frontend/src/pages/News/List.tsx`
- Create: `frontend/src/pages/News/Detail.tsx`

- [ ] **Step 1: 创建新闻列表页面**

```typescript
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { List, Card, Select, Empty, Spin } from 'antd'
import { newsService } from '@/services'
import type { News, NewsCategory, NEWS_CATEGORIES } from '@/types'
import { NEWS_CATEGORY_LABELS } from '@/types'
import Pagination from '@/components/Pagination'

const NewsList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [newsList, setNewsList] = useState<News[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category') as NewsCategory | null

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const response = await newsService.getNewsList({
          page,
          pageSize: 10,
          category: category || undefined
        })
        setNewsList(response.data)
        setTotal(response.total)
      } catch (error) {
        console.error('获取新闻列表失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchNews()
  }, [page, category])

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), ...(category ? { category } : {}) })
  }

  const handleCategoryChange = (newCategory: NewsCategory | undefined) => {
    setSearchParams({ page: '1', ...(newCategory ? { category: newCategory } : {}) })
  }

  return (
    <div className="news-list-page">
      <Card title="新闻中心" extra={
        <Select
          placeholder="选择分类"
          style={{ width: 150 }}
          value={category || undefined}
          onChange={handleCategoryChange}
          allowClear
        >
          {(NEWS_CATEGORIES as readonly NewsCategory[]).map(cat => (
            <Select.Option key={cat} value={cat}>
              {NEWS_CATEGORY_LABELS[cat]}
            </Select.Option>
          ))}
        </Select>
      }>
        <Spin spinning={loading}>
          {newsList.length === 0 && !loading ? (
            <Empty description="暂无新闻" />
          ) : (
            <List
              dataSource={newsList}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={`#/news/${item.id}`}>{item.title}</a>}
                    description={
                      <div>
                        <span className="news-category">{NEWS_CATEGORY_LABELS[item.category]}</span>
                        <span className="news-date">{new Date(item.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
        
        {newsList.length > 0 && (
          <Pagination
            current={page}
            pageSize={10}
            total={total}
            onChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  )
}

export default NewsList
```

- [ ] **Step 2: 创建新闻详情页面**

```typescript
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Empty, Spin } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { newsService } from '@/services'
import type { News } from '@/types'
import { NEWS_CATEGORY_LABELS } from '@/types'

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const data = await newsService.getNewsById(parseInt(id))
        setNews(data)
      } catch (error) {
        console.error('获取新闻详情失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchNews()
  }, [id])

  if (loading) {
    return (
      <div className="news-detail-page">
        <Spin size="large" />
      </div>
    )
  }

  if (!news) {
    return (
      <div className="news-detail-page">
        <Empty description="新闻不存在" />
        <Button type="primary" onClick={() => navigate('/news')}>
          返回新闻列表
        </Button>
      </div>
    )
  }

  return (
    <div className="news-detail-page">
      <Card>
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate('/news')}
          style={{ marginBottom: 16 }}
        >
          返回列表
        </Button>
        
        <div className="news-detail">
          <h1 className="news-title">{news.title}</h1>
          <div className="news-meta">
            <span className="meta-category">{NEWS_CATEGORY_LABELS[news.category]}</span>
            <span className="meta-date">
              发布时间：{news.publishTime 
                ? new Date(news.publishTime).toLocaleString('zh-CN')
                : new Date(news.createdAt).toLocaleString('zh-CN')
              }
            </span>
          </div>
          
          {news.coverImage && (
            <img src={news.coverImage} alt={news.title} className="news-cover" />
          )}
          
          <div 
            className="news-content" 
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </Card>
    </div>
  )
}

export default NewsDetail
```

- [ ] **Step 3: 提交**

```bash
git add frontend/src/pages/News/
git commit -m "feat: 创建新闻列表和详情页面"
```

---

### Task 17: 创建公告相关页面

**Files:**
- Create: `frontend/src/pages/Announcements/List.tsx`
- Create: `frontend/src/pages/Announcements/Detail.tsx`

- [ ] **Step 1: 创建公告列表页面**

```typescript
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { List, Card, Tag, Empty, Spin } from 'antd'
import { announcementService } from '@/services'
import type { Announcement } from '@/types'
import Pagination from '@/components/Pagination'

const AnnouncementsList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true)
      try {
        const response = await announcementService.getAnnouncementsList({ page, pageSize: 10 })
        setAnnouncements(response.data)
        setTotal(response.total)
      } catch (error) {
        console.error('获取公告列表失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnnouncements()
  }, [page])

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() })
  }

  return (
    <div className="announcements-list-page">
      <Card title="通知公告">
        <Spin spinning={loading}>
          {announcements.length === 0 && !loading ? (
            <Empty description="暂无公告" />
          ) : (
            <List
              dataSource={announcements}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span>
                        {item.isPinned && <Tag color="red">置顶</Tag>}
                        <a href={`#/announcements/${item.id}`}>{item.title}</a>
                      </span>
                    }
                    description={
                      <span className="announcement-date">
                        发布时间：{item.publishTime 
                          ? new Date(item.publishTime).toLocaleDateString('zh-CN')
                          : new Date(item.createdAt).toLocaleDateString('zh-CN')
                        }
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
        
        {announcements.length > 0 && (
          <Pagination
            current={page}
            pageSize={10}
            total={total}
            onChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  )
}

export default AnnouncementsList
```

- [ ] **Step 2: 创建公告详情页面**

```typescript
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Empty, Spin, Tag } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { announcementService } from '@/services'
import type { Announcement } from '@/types'

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const data = await announcementService.getAnnouncementById(parseInt(id))
        setAnnouncement(data)
      } catch (error) {
        console.error('获取公告详情失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnnouncement()
  }, [id])

  if (loading) {
    return (
      <div className="announcement-detail-page">
        <Spin size="large" />
      </div>
    )
  }

  if (!announcement) {
    return (
      <div className="announcement-detail-page">
        <Empty description="公告不存在" />
        <Button type="primary" onClick={() => navigate('/announcements')}>
          返回公告列表
        </Button>
      </div>
    )
  }

  return (
    <div className="announcement-detail-page">
      <Card>
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate('/announcements')}
          style={{ marginBottom: 16 }}
        >
          返回列表
        </Button>
        
        <div className="announcement-detail">
          <h1 className="announcement-title">
            {announcement.isPinned && <Tag color="red" style={{ marginRight: 8 }}>置顶</Tag>}
            {announcement.title}
          </h1>
          <div className="announcement-meta">
            <span className="meta-date">
              发布时间：{announcement.publishTime 
                ? new Date(announcement.publishTime).toLocaleString('zh-CN')
                : new Date(announcement.createdAt).toLocaleString('zh-CN')
              }
            </span>
          </div>
          
          <div 
            className="announcement-content" 
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>
      </Card>
    </div>
  )
}

export default AnnouncementDetail
```

- [ ] **Step 3: 提交**

```bash
git add frontend/src/pages/Announcements/
git commit -m "feat: 创建公告列表和详情页面"
```

---

### Task 18: 创建报名表单页面

**Files:**
- Create: `frontend/src/pages/Registration/Form.tsx`
- Create: `frontend/src/pages/Registration/Success.tsx`
- Create: `frontend/src/utils/validators.ts`

- [ ] **Step 1: 创建验证工具**

```typescript
export const validateIdCard = (value: string): string | undefined => {
  if (!value) return '请输入身份证号'
  if (value.length < 15 || value.length > 18) return '身份证号长度不正确'
  
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/
  if (!reg.test(value)) return '身份证号格式不正确'
  
  return undefined
}

export const validatePhone = (value: string): string | undefined => {
  if (!value) return '请输入手机号'
  if (value.length !== 11) return '手机号长度不正确'
  
  const reg = /^1[3-9]\d{9}$/
  if (!reg.test(value)) return '手机号格式不正确'
  
  return undefined
}

export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
```

- [ ] **Step 2: 创建报名表单页面**

```typescript
import { useState, useEffect } from 'react'
import { Steps, Form, Input, Radio, DatePicker, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { registrationService } from '@/services'
import type { StudentInfo, ParentsInfo } from '@/types'
import { validateIdCard, validatePhone } from '@/utils/validators'

const { Step } = Steps

const RegistrationForm = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [registrationNumber, setRegistrationNumber] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedNumber = localStorage.getItem('registrationDraftNumber')
    if (savedNumber) {
      setRegistrationNumber(savedNumber)
    }
  }, [])

  const steps = [
    { title: '学生基本信息', description: '填写学生的个人基本信息' },
    { title: '父母/监护人信息', description: '填写父母或监护人的信息' },
    { title: '确认提交', description: '确认填写的信息并提交' },
  ]

  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      const result = await registrationService.saveDraft({
        registrationNumber,
        student: values.student,
        parents: values.parents
      })
      
      setRegistrationNumber(result.registrationNumber)
      localStorage.setItem('registrationDraftNumber', result.registrationNumber)
      message.success('草稿保存成功')
    } catch (error) {
      console.error('保存草稿失败:', error)
      message.error('保存草稿失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      const result = await registrationService.submitRegistration({
        registrationNumber,
        student: values.student,
        parents: values.parents
      })
      
      localStorage.removeItem('registrationDraftNumber')
      navigate(`/registration/success?number=${result.registrationNumber}`)
    } catch (error: any) {
      console.error('提交报名失败:', error)
      if (error.response?.data?.detail) {
        message.error(error.response.data.detail)
      } else {
        message.error('提交失败，请检查填写的信息')
      }
    } finally {
      setLoading(false)
    }
  }

  const next = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['student'])
      } else if (currentStep === 1) {
        await form.validateFields(['parents'])
      }
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  const prev = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="registration-form-page">
      <div className="form-container">
        <h1>新生在线报名</h1>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />
        
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            student: { gender: 'male' },
          }}
        >
          {currentStep === 0 && (
            <div className="step-content">
              <h2>学生基本信息</h2>
              <Form.Item label="姓名" name={['student', 'name']} rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入学生姓名" maxLength={50} />
              </Form.Item>
              
              <Form.Item label="性别" name={['student', 'gender']} rules={[{ required: true, message: '请选择性别' }]}>
                <Radio.Group>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item label="出生日期" name={['student', 'birthDate']} rules={[{ required: true, message: '请选择出生日期' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
              </Form.Item>
              
              <Form.Item label="身份证号" name={['student', 'idCard']} rules={[{ validator: (_, value) => Promise[resolve, reject] {
                const error = validateIdCard(value)
                error ? reject(error) : resolve()
              }] }]}>
                <Input placeholder="请输入身份证号" maxLength={18} />
              </Form.Item>
              
              <Form.Item label="家庭住址" name={['student', 'address']} rules={[{ required: true, message: '请输入家庭住址' }]}>
                <Input.TextArea placeholder="请输入详细家庭住址" rows={3} maxLength={200} />
              </Form.Item>
              
              <Form.Item label="联系电话" name={['student', 'phone']} rules={[{ validator: (_, value) => Promise[resolve, reject] {
                const error = validatePhone(value)
                error ? reject(error) : resolve()
              }] }]}>
                <Input placeholder="请输入联系电话" maxLength={11} />
              </Form.Item>
            </div>
          )}
          
          {currentStep[ === 1 && (
            <div className="step-content">
              <h2>父亲信息</h2>
              <Form.Item label="姓名" name={['parents', 'father', 'name']} rules={[{ required: true, message: '请输入父亲姓名' }]}>
                <Input placeholder="请输入父亲姓名" maxLength={50} />
              </Form.Item>
              
              <Form.Item label="联系电话" name={['parents', 'father', 'phone']} rules={[{ validator: (_, value) => Promise[resolve, reject] {
                const error = validatePhone(value)
                error ? reject(error) : resolve()
              }] }]}>
                <Input placeholder="请输入联系电话" maxLength={11} />
              </Form.Item>
              
              <Form.Item label="工作单位" name={['parents', 'father', 'workUnit']}>
                <InputInput placeholder="请输入工作单位（选填）" maxLength={100} />
              </Form.Item>
              
              <h2>母亲信息</h2>
              <Form.Item label="姓名" name={['parents', 'mother', 'name']} rules={[{ required: true, message: '请输入母亲姓名' }]}>
                <Input placeholder="请输入母亲姓名" maxLength={50} />
              </Form.Item>
              
              <Form.Item label="联系电话" name={['parents', 'mother', 'phone']} rules={[{ validator: (_, value) => Promise[resolve, reject] {
                const error = validatePhone(value)
                error ? reject(error) : resolve()
              }] }]}>
                <Input placeholder="请输入联系电话" maxLength={11} />
              </Form.Item>
              
              <Form.Item label="工作单位" name={['parents', 'mother', 'workUnit']}>
                <Input placeholder="请输入工作单位（选填）" maxLength={100} />
              </Form.Item>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="step-content confirmation-step">
              <h2>确认信息</h2>
              <div className="info-summary">
                请确认填写的信息无误后提交
              </div>
            </div>
          )}
        </Form>
        
        <div className="form-actions">
          {currentStep > 0 && (
            <button onClick={prev}>
              上一步
            </button>
          )}
          
          {currentStep < steps.length - 1 && (
            <>
              <button type="default" onClick={handleSaveDraft} loading={loading}>
                保存草稿
              </button>
              <button type="primary" onClick={next}>
                下一步
              </button>
            </>
          )}
          
          {currentStep === steps.length - 1 && (
            <>
              <button type="default" onClick={handleSaveDraft} loading={loading}>
                保存草稿
              </button>
              <button type="primary" onClick={handleSubmit} loading={loading}>
                提交报名
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegistrationForm
```

- [ ] **Step 3: 创建报名成功页面**

```typescript
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Result, Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

const RegistrationSuccess = () => {
  const [searchParams] = useSearchParams()
  const [registrationNumber, setRegistrationNumber] = useState('')

  useEffect(() => {
    const number = searchParams.get('number')
    if (number) {
      setRegistrationNumber(number)
    }
  }, [searchParams])

  return (
    <div className="registration-success-page">
      <Card>
        <Result
          status="success"
          title="报名成功！"
          subTitle={
            <div>
              <p>您的报名号是：<strong>{registrationNumber}</strong></p>
              <p>请妥善保存报名号，学校将根据报名号进行后续通知</p>
            </div>
          }
          extra={[
            <Button type="primary" key="home" href="#/" icon={<HomeOutlined />}>
              返回首页
            </Button>,
          ]}
        />
      </Card>
    </div>
  )
}

export default RegistrationSuccess
```

- [ ] **Step 4: 提交**

```bash
git add frontend/src/pages/Registration/ frontend/src/utils/
git commit -m "feat: 创建报名表单和成功页面"
```

---

## 第五阶段：后台管理页面

### Task 19: 创建后台管理布局和框架

**Files:**
- Create: `frontend/src/pages/Admin/Layout.tsx`
- Create: `frontend/src/router.tsx` (更新)

- [ ] **Step 1: 创建后台布局**

```typescript
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { 
  DesktopOutlined, 
  FileTextOutlined, 
  NotificationOutlined, 
  UserOutlined,
  HomeOutlined 
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

const AdminLayout = () => {
  const location = useLocation()
  
  const menuItems = [
    { key: '/admin/news', icon: <FileTextOutlined />, label: <Link to="/admin/news">新闻管理</Link> },
    { key: '/admin/announcements', icon: <NotificationOutlined />, label: <Link to="/admin/announcements">公告管理</Link> },
    { key: '/admin/registrations', icon: <UserOutlined />, label: <Link to="/admin/registrations">报名管理</Link> },
  ]

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/admin/news')) return '/admin/news'
    if (location.pathname.startsWith('/admin/announcements')) return '/admin/announcements'
    if (location.pathname.startsWith('/admin/registrations')) return '/admin/registrations'
    return location.pathname
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div className="admin-logo">
          <Link to="/">
            <HomeOutlined /> XX中学
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <span>后台管理系统</span>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: '24px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
```

- [ ] **Step 2: 更新路由配置**

```typescript
import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import SchoolIntro from '@/pages/SchoolIntro'
import NewsList from '@/pages/News/List'
import NewsDetail from '@/pages/News/Detail'
import AnnouncementsList from '@/pages/Announcements/List'
import AnnouncementsDetail from '@/pages/Announcements/Detail'
import RegistrationForm from '@/pages/Registration/Form'
import RegistrationSuccess from '@/pages/Registration/Success'
import Notice from '@/pages/Notice'
import Contact from '@/pages/Contact'
import AdminLayout from '@/pages/Admin/Layout'
import NewsManage from '@/pages/Admin/News'
import AnnouncementsManage from '@/pages/Admin/Announcements'
import RegistrationsManage from '@/pages/Admin/Registrations'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/school-intro',
    element: <SchoolIntro />,
  },
  {
    path: '/news',
    element: <NewsList />,
  },
  {
    path: '/news/:id',
    element: <NewsDetail />,
  },
  {
    path: '/announcements',
    element: <AnnouncementsList />,
  },
  {
    path: '/announcements/:id',
    element: <AnnouncementsDetail />,
  },
  {
    path: '/registration',
    element: <RegistrationForm />,
  },
  {
    path: '/registration/success',
    element: <RegistrationSuccess />,
  },
  {
    path: '/notice',
    element: <Notice />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'news',
        element: <NewsManage />,
      },
      {
        path: 'announcements',
        element: <AnnouncementsManage />,
      },
      {
        path: 'registrations',
        element: <RegistrationsManage />,
      },
    ],
  },
])

export default router
```

- [ ]`**Step 3: 提交**

```bash
git add frontend/src/pages/Admin/Layout.tsx frontend/src/router.tsx
git commit -m "feat: 创建后台管理布局和路由"
```

---

### Task 20: 创建新闻管理页面

**Files:**
- Create: `frontend/src/pages/Admin/News.tsx`
- Update: `frontend/src/services/news.ts`

- [ ] **Step 1: 更新新闻服务，添加管理接口**

```typescript
export const newsService = {
  // ... existing methods ...

  async createNews(data: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News> {
    const response = await axios.post<News>(`${API_BASE}/admin/news`, data)
    return response.data
  },

  async updateNews(id: number, data: Partial<News>): Promise<News> {
    const response = await axios.put<News>(`${API_BASE}/admin/news/${id}`, data)
    return response.data
  },

  async deleteNews(id: number): Promise<{ success: boolean }> {
    const response = await axios.delete<{ success: boolean }>(`${API_BASE}/admin/news/${id}`)
    return response.data
  },
}
```

- [ ] **Step 2: 创建新闻管理页面**

```typescript
import { useEffect, useState } from 'react'
import { 
  Table, Button, Modal, Form, Input, Select, DatePicker, message, 
  Popconfirm, Space, Tag 
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { newsService } from '@/services'
import type { News, NewsCategory } from '@/types'
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS } from '@/types'
import dayjs from 'dayjs'

const NewsManage = () => {
  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const fetchNews = async (page = 1) => {
    setLoading(true)
    try {
      const response = await newsService.getNewsList({ page, pageSize: 10 })
      setNewsList(response.data)
      setPagination({ current: page, pageSize: 10, total: response.total })
    } catch (error) {
      console.error('获取新闻列表失败:', error)
      message.error('获取新闻列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleAdd = () => {
    setEditingNews(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: News) => {
    setEditingNews(record)
    form.setFieldsValue({
      ...record,
      publishTime: record.publishTime ? dayjs(record.publishTime) : null,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await newsService.deleteNews(id)
      message.success('删除成功')
      fetchNews(pagination.current)
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const data = {
        ...values,
        publishTime: values.publishTime ? values.publishTime.toISOString() : null,
      }

      if (editingNews) {
        await newsService.updateNews(editingNews.id, data)
        message.success('更新成功')
      } else {
        await newsService.createNews(data)
        message.success('创建成功')
      }

      setModalVisible(false)
      fetchNews(pagination.current)
    } catch (error: any) {
      console.error('提交失败:', error)
      message.error(error.response?.data?.detail || '提交失败')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: NewsCategory) => (
        <Tag color="blue">{NEWS_CATEGORY_LABELS[category]}</Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 180,
      render: (time: string | undefined) => 
        time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: News) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除这条新闻吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="news-manage">
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建新闻
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={newsList}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => fetchNews(page),
        }}
      />

      <Modal
        title={editingNews ? '编辑新闻' : '新建新闻'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" maxLength={200} />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {(NEWS_CATEGORIES as readonly NewsCategory[]).map(cat => (
                <Select.Option key={cat} value={cat}>
                  {NEWS_CATEGORY_LABELS[cat]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="发布时间"
            name="publishTime"
          >
            <DatePicker 
              showTime 
              style={{ width: '100%' }}
              placeholder="请选择发布时间"
            />
          </Form.Item>

          <Form.Item
            label="封面图片"
            name="coverImage"
          >
            <Input placeholder="请输入封面图片URL" />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default NewsManage
```

- [ ] **Step 3: 更新 package.json 添加 dayjs**

```json
"dayjs": "^1.11.10"
```

- [ ] **Step 4: 提交**

```bash
git add frontend/src/pages/Admin/News.tsx frontend/src/services/news.ts frontend/package.json
git commit -m "feat: 创建新闻管理页面"
```

---

### Task 21: 创建公告管理页面

**Files:**
- Create: `frontend/src/pages/Admin/Announcements.tsx`
- Update: `frontend/src/services/announcements.ts`

- [ ] **Step 1: 更新公告服务，添加管理接口**

```typescript
export const announcementService = {
  // ... existing methods ...

  async createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
    const response = await axios.post<Announcement>(`${API_BASE}/admin/announcements`, data)
    return response.data
  },

  async updateAnnouncement(id: number, data: Partial<Announcement>): Promise<Announcement> {
    const response = await axios.put<Announcement>(`${API_BASE}/admin/announcements/${id}`, data)
    return response.data
  },

  async deleteAnnouncement(id: number): Promise<{ success: boolean }> {
    const response = await axios.delete<{ success: boolean }>(`${API_BASE}/admin/announcements/${id}`)
    return response.data
  },
}
```

- [ ] **Step 2: 创建公告管理页面**

```typescript
import { useEffect, useState } from 'react'
import { 
  Table, Button, Modal, Form, Input, DatePicker, message, 
  Popconfirm, Space, Tag, Switch 
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { announcementService } from '@/services'
import type { Announcement } from '@/types'
import dayjs from 'dayjs'

const AnnouncementsManage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const fetchAnnouncements = async (page = 1) => {
    setLoading(true)
    try {
      const response = await announcementService.getAnnouncementsList({ page, pageSize: 10 })
      setAnnouncements(response.data)
      setPagination({ current: page, pageSize: 10, total: response.total })
    } catch (error) {
      console.error('获取公告列表失败:', error)
      message.error('获取公告列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const handleAdd = () => {
    setEditingAnnouncement(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Announcement) => {
    setEditingAnnouncement(record)
    form.setFieldsValue({
      ...record,
      publishTime: record.publishTime ? dayjs(record.publishTime) : null,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await announcementService.deleteAnnouncement(id)
      message.success('删除成功')
      fetchAnnouncements(pagination.current)
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
    }
  }

  const handleSubmit = async() => {
    try {
      const values = await form.validateFields()
      const data = {
        ...values,
        publishTime: values.publishTime ? values.publishTime.toISOString() : null,
      }

      if (editingAnnouncement) {
        await announcementService.updateAnnouncement(editingAnnouncement.id, data)
        message.success('更新成功')
      } else {
        await announcementService.createAnnouncement(data)
        message.success('创建成功')
      }

      setModalVisible(false)
      fetchAnnouncements(pagination.current)
    } catch (error: any) {
      console.error('提交失败:', error)
      message.error(error.response?.data?.detail || '提交失败')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '是否置顶',
      dataIndex: 'isPinned',
      key: 'isPinned',
      width: 100,
      render: (pinned: boolean) => (
        pinned ? <Tag color="red">置顶</Tag> : '-'
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 180,
      render: (time: string | undefined) => 
        time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Announcement) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除这条公告吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="announcements-manage">
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建公告
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={announcements}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => fetchAnnouncements(page),
        }}
      />

      <Modal
        title={editingAnnouncement ? '编辑公告' : '新建公告'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        on onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" maxLength={200} />
          </Form.Item>

          <Form.Item
            label="是否置顶"
            name="isPinned"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="发布时间"
            name="publishTime"
          >
            <DatePicker 
              showTime 
              style={{ width: '100%' }}
              placeholder="请选择发布时间"
            />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AnnouncementsManage
```

- [ ] **Step 3: 提交**

```bash
git add frontend/src/pages/Admin/Announcements.tsx frontend/src/services/announcements.ts
git commit -m "feat: 创建公告管理页面"
```

---

### Task 22: 创建报名管理页面

**Files:**
- Create: `frontend/src/pages/Admin/Registrations.tsx`
- Update: `frontend/src/services/registrations.ts`

- [ ] **Step 1: 更新报名服务，添加管理接口**

```typescript
export const registrationService = {
  // ... existing methods ...

  async getRegistrationsList(params: {
    page?: number
    pageSize?: number
    name?: string
    startDate?: string
    endDate?: string
  } = {}): Promise<{ data: Registration[]; total: number }> {
    const response = await axios.get<{ data: Registration[]; total: number }>(
      `${API_BASE}/admin/registrations`,
      { params }
    )
    return response.data
  },

  async getRegistrationById(id: number): Promise<Registration> {
    const response = await axios.get<Registration>(`${API_BASE}/admin/registrations/${id}`)
    return response.data
  },

  async exportRegistrations(params?: {
    startDate?: string
    endDate?: string
  }): Promise<Blob> {
    const response = await axios.get(`${API_BASE}/admin/registrations/export`, {
      params,
      responseType: 'blob',
    })
    return response.data
  },
}
```

- [ ] **Step 2: 创建报名管理页面**

```typescript
import { useEffect, useState } from 'react'
import { 
  Table, Button, Modal, Input, DatePicker, message, 
  Space, Tag, Descriptions, Select 
} from 'antd'
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons'
import { registrationService } from '@/services'
import type { Registration } from '@/types'
import dayjs from 'dayjs'

const RegistrationsManage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [searchName, setSearchName] = useState('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const fetchRegistrations = async (page = 1) => {
    setLoading(true)
    try {
      const params: any = { page, pageSize: 10 }
      if (searchName) params.name = searchName
      if (dateRange) {
        params.startDate = dateRange[0].format('YYYY-MM-DD')
        params.endDate = dateRange[1].format('YYYY-MM-DD')
      }
      
      const response = await registrationService.getRegistrationsList(params)
      setRegistrations(response.data)
      setPagination({ current: page, pageSize: 10, total: response.total })
    } catch (error) {
      console.error('获取报名列表失败:', error)
      message.error('获取报名列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [searchName, dateRange])

  const handleViewDetail = (record: Registration) => {
    setSelectedRegistration(record)
    setDetailVisible(true)
  }

  const handleExport = async () => {
    try {
      const params: any = {}
      if (dateRange) {
        params.startDate = dateRange[0].format('YYYY-MM-DD')
        params.endDate = dateRange[1].format('YYYY-MM-DD')
      }
      
      const blob = await registrationService.exportRegistrations(params)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `报名数据_${dayjs().format('YYYY-MM-DD')}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      message.success('导出成功')
    } catch (error) {
      console.error('导出失败:', error)
      message.error('导出失败')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '报名号',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      width: 120,
    },
    {
      title: '学生姓名',
      dataIndex: 'student',
      key: 'studentName',
      width: 100,
      render: (student: any) => student.name,
    },
    {
      title: '性别',
      dataIndex: 'student',
      key: 'gender',
      width: 80,
      render: (student: any) => student.gender === 'male' ? '男' : '女',
    },
    {
      title: '联系电话',
      dataIndex: 'student',
      key: 'phone',
      width: 120,
      render: (student: any) => student.phone,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        status === 'submitted' 
          ? <Tag color="green">已提交</Tag>
          : <Tag color="orange">草稿</Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: Registration) => (
        <Button 
          type="link" 
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      ),
    },
  ]

  return (
    <div className="registrations-manage">
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="搜索学生姓名"
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <DatePicker.RangePicker
          style={{ width: 300 }}
          onChange={(dates) => setDateRange(dates as any)}
        />
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleExport}
        >
          导出 Excel
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={registrations}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => fetchRegistrations(page),
        }}
      />

      <Modal
        title="报名详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRegistration && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="报名号" span={2}>
              {selectedRegistration.registrationNumber}
            </Descriptions.Item>
            
            <Descriptions.Item label="学生姓名">
              {selectedRegistration.student.name}
            </Descriptions.Item>
            <Descriptions.Item label="性别">
              {selectedRegistration.student.gender === 'male' ? '男' : '女'}
            </Descriptions.Item>
            
            <Descriptions.Item label="出生日期">
              {dayjs(selectedRegistration.student.birthDate).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="身份证号">
              {selectedRegistration.student.idCard}
            </Descriptions.Item>
            
            <Descriptions.Item label="家庭住址" span={2}>
              {selectedRegistration.student.address}
            </Descriptions.Item>
            
            <Descriptions.Item label="联系电话" span={2}>
              {selectedRegistration.student.phone}
            </Descriptions.Item>
            
            <Descriptions.Item label="父亲姓名">
              {selectedRegistration.parents.father.name}
            </Descriptions.Item>
            <Descriptions.Item label="父亲电话">
              {selectedRegistration.parents.father.phone}
            </Descriptions.Item>
            
            <Descriptions.Item label="父亲工作单位" span={2}>
              {selectedRegistration.parents.father.workUnit || '-'}
            </Descriptions.Item>
            
            <Descriptions.Item label="母亲姓名">
              {selectedRegistration.parents.mother.name}
            </Descriptions.Item>
            <Descriptions.Item label="母亲电话">
              {selectedRegistration.parents.mother.phone}
            </Descriptions.Item>
            
            <Descriptions.Item label="母亲工作单位" span={2}>
              {selectedRegistration.parents.mother.workUnit || '-'}
            </Descriptions.Item>
            
            <Descriptions.Item label="状态">
              {selectedRegistration.status === 'submitted' 
                ? <Tag color="green">已提交</Tag>
                : <Tag color="orange">草稿</Tag>
              }
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">
              {dayjs(selectedRegistration.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default RegistrationsManage
```

- [ ] **Step 3: 提交**

```bash
git add frontend/src/pages/Admin/Registrations.tsx frontend/src/services/registrations.ts
git commit -m "feat: 创建报名管理页面"
```

---

## 第六阶段：样式和优化

### Task 23: 创建全局样式

**Files:**
- Create: `frontend/src/index.css`

- [ ] **Step 1: 创建全局样式文件**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.logo a {
 {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  text-decoration: none;
  margin-right: 48px;
}

.header-menu {
  flex: 1;
  border: none;
}

.main-content {
  flex: 1;
  background: #f5f5f5;
}

.footer {
  background: #001529;
  color: #fff;
  padding: 48px 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  padding: 0 24px;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 24px;
  color: #fff;
}

.footer-section a {
  display: block;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #fff;
}

.footer-section p {
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 12px;
}

.footer-bottom {
  max-width: 1200px;
  margin: 48px auto 0;
  padding: 0 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
}

/* 页面样式 */
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 80px 48px;
  margin-bottom: 32px;
  border-radius: 8px;
}

.hero-content {
  text-align: center;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 16px;
}

.hero p {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.school-intro-page,
.notice-page,
.contact-page {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

.intro-text h3,
.campus-images h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #1890ff;
}

.image-placeholder {
  background: #f0f0f0;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border-radius: 4px;
}

.news-list-page,
.news-detail-page,
.announcements-list-page,
.announcement-detail-page {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

.news-meta,
.announcement-meta {
  color: #999;
  font-size: 14px;
  margin-top: 8px;
}

.news-category,
.meta-category {
  margin-right: 16px;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
}

.news-date,
.announcement-date {
  color: #999;
}

.news-detail,
.announcement-detail {
  padding: 24px 0;
}

.news-title,
.announcement-title {
  font-size: 32px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.news-cover {
  max-width: 100%;
  margin: 24px 0;
  border-radius: 8px;
}

.news-content,
.announcement-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.registration-form-page {
  max-width: 800px;
  margin: 24px auto;
  padding: 0 24px;
}

.form-container {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-container h1 {
  text-align: center;
  margin-bottom: 32px;
  color: #1890ff;
}

.step-content {
  padding: 24px 0;
}

.step-content h2 {
  margin-bottom: 24px;
  color: #1890ff;
}

.form-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.confirmation-step {
  text-align: center;
}

.info-summary {
  font-size: 18px;
  color: #666;
  padding: 24px;
  background: #f5f5f5;
  border-radius: 8px;
}

.registration-success-page {
  max-width: 600px;
  margin: 48px auto;
  padding: 0 24px;
}

/* 后台管理样式 */
.admin-logo a {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  text-decoration: none;
}

.news-man-mage,
.announcements-manage,
.registrations-manage {
  padding: 0;
}

/* 分页样式 */
.pagination-container {
  margin-top: 24px;
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .hero {
    padding: 48px 24px;
  }
  
  .hero h1 {
    font-size: 32px;
  }
  
  .hero p {
    font-size: 16px;
  }
  
  .header-container {
    flex-direction: column;
    padding: 12px;
  }
  
  .logo a {
    margin-right: 0;
    margin-bottom: 12px;
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/index.css
git commit -m "feat: 创建全局样式和响应式布局"
```

---

### Task 24: 初始化数据库并运行测试

**Files:**
- Create: `backend/app/scripts/init_db.py`

- [ ] **Step 1: 创建数据库初始化脚本**

```python
from app.core.database import engine, Base
from app.models.news import News
from app.models.announcement import Announcement
import sys

def init_db():
    print("创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成！")

if __name__ == "__main__":
    init_db()
```

- [ ] **Step 2: 运行所有测试**

```bash
cd backend
pytest tests/ -v --cov=app
```

- [ ] **Step 3: 提交**

```bash
git add backend/app/scripts/init_db.py
git commit -m "feat: 添加数据库初始化脚本"
```

---

### Task 25: 最终文档和部署准备

**Files:**
- Create: `README.md`
- Create: `DEPLOYMENT.md`

- [ ] **Step 1: 创建项目 README**

```markdown
# XX中学官方网站

## 项目简介

XX中学官方网站是一个基于前后端分离架构的现代化学校网站系统，包含前台信息展示、在线报名系统和后台管理功能。

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Ant Design
- React Router
- Axios

### 后端
- Python 3.10+
- FastAPI
- SQLAlchemy
- SQLite

## 快速开始

### 前置要求

- Node.js 18+
- Python 3.10+
- Docker & Docker Compose

### 使用 Docker Compose 启动

```bash
# 启动所有服务
docker-compose up

# 查看日志
``docker-compose logs -f

# 停止服务
docker-compose down
```

### 本地开发

#### 后端开发

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 初始化数据库
python -m app.scripts.init_db

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8084
```

#### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 项目结构

```
.
├── backend/          # 后端 FastAPI 项目
├── frontend/         # 前端 React 项目
├── docker-compose.yml # Docker 编排配置
└── README.md         # 项目说明
```

## 功能特性

### 前台功能
- 学校介绍展示
- 新闻中心（支持分类）
- 通知公告（支持置顶）
- 在线报名系统（分步表单）
- 报名须知和联系方式

### 后台管理
- 新闻管理（CRUD）
- 公告管理（CRUD）
- 报名管理（查看、搜索、导出）

## 开发规范

### 代码提交
```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 联系方式

- 技术支持：待定
- 项目负责人：待定
```

- [ ] **Step 2: 创建部署文档**

```markdown
# 部署文档

## 开发环境部署

### 使用 Docker Compose

```bash
# 克隆项目
git clone <repository-url>
cd project-name

# 启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 访问地址

- 前台：http://localhost:8083
- 后台 API：http://localhost:8084
- API 文档：http://localhost:8084/docs

## 生产环境部署

### 准备工作

1. 修改环境变量
2. 配置 HTTPS 证书
3. 设置数据库备份策略

### 使用 Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 配置 Nginx 反向代理（可选）
```

### 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:8084;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 数据库管理

### 备份

```bash
# 备份 SQLite 数据库
cp backend/data/school.db backend/data/school.db.backup
```

### 恢复

```bash
# 恢复 SQLite 数据库
cp backend/data/school.db.backup backend/data/school.db
```

## 监控和日志

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 性能监控

建议使用以下工具进行性能监控：
- 前端：Lighthouse
- 后端：Prometheus + Grafana

## 故障排查

### 常见问题

1. **端口被占用**
   - 修改 docker-compose.yml 中的端口映射

2. **数据库连接失败**
   - 检查数据库文件权限
   - 确认 DATABASE_URL 配置正确

3. **前端无法访问后端 API**
   - 检查 CORS 配置
   - 确认后端服务正常运行

## 升级和维护

### 升级版本

```bash
# 拉取最新代码
git pull origin main

# 重新构建镜像
docker-compose build

# 重启服务
docker-compose up -d
```

### 数据迁移

如需进行数据库结构变更：

1. 备份数据库
2. 编写迁移脚本
3. 执行迁移
4. 验证数据完整性
```

- [ ] **Step 3: 提交**

```bash
git add README.md DEPLOYMENT.md
git commit -m "docs: 添加项目说明和部署文档"
```

---

## 实施计划完成检查表

- [ ] 后端基础架构搭建（Tasks 1-8）
- [ ] 公告和报名 API（Tasks 9-10）
- [ ] 前端基础架构（Tasks 11-14）
- [ ] 前台页面实现（Tasks 15-18）
- [ ] 后台管理页面（Tasks 19-22）
- [ ] 样式和优化（Tasks 23-25）

---

## 说明

本实施计划涵盖了 XX中学官方网站的完整开发流程，包括：

1. **后端开发**：FastAPI + SQLite + SQLAlchemy
2. **前端开发**：React + TypeScript + Ant Design
3. **功能实现**：新闻、公告、报名系统
4. **后台管理**：CRUD 操作和数据导出
5. **部署配置**：Docker Compose

每个任务都包含详细的实施步骤、测试用例和提交信息，确保开发过程的可靠性和可追溯性。

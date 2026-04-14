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

from app.api.news import router as news_router, admin_router as admin_news_router
from app.api.announcements import router as announcements_router, admin_router as admin_announcements_router
from app.api.registrations import router as registrations_router, admin_router as admin_registrations_router

app.include_router(news_router)
app.include_router(admin_news_router)
app.include_router(announcements_router)
app.include_router(admin_announcements_router)
app.include_router(registrations_router)
app.include_router(admin_registrations_router)

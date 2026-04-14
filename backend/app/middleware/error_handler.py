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

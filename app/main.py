"""Application entry point for the HRMS Lite backend."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.attendance_routes import router as attendance_router
from app.api.routes.employee_routes import router as employee_router
from app.core.config import get_settings
from app.core.database import Base, engine
from app.schemas.common import ErrorResponse, HealthResponse
from app.utils.exceptions import APIException

settings = get_settings()


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Run startup and shutdown tasks for the FastAPI app."""
    del application
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee_router, prefix=settings.api_v1_prefix)
app.include_router(attendance_router, prefix=settings.api_v1_prefix)


@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
    """Return consistent JSON for known business exceptions."""
    del request
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error={
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            }
        ).model_dump(),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Convert Pydantic/FastAPI validation errors into a uniform payload."""
    del request
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            error={
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed.",
                "details": {"errors": exc.errors()},
            }
        ).model_dump(),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Normalize framework-generated HTTP exceptions."""
    del request
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error={
                "code": "HTTP_ERROR",
                "message": str(exc.detail),
                "details": None,
            }
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Protect API consumers from raw server exceptions."""
    del request, exc
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error={
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred.",
                "details": None,
            }
        ).model_dump(),
    )


@app.get("/")
def root() -> dict[str, str]:
    """Return basic API metadata for the root path."""
    return {
        "message": "HRMS Lite API is running.",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Return a basic health status for uptime checks."""
    return HealthResponse(status="ok")

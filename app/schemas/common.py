"""Common response schemas shared across the API."""

from typing import Any

from pydantic import BaseModel, Field


class MessageResponse(BaseModel):
    """Simple success response with a message."""

    message: str = Field(..., examples=["Resource created successfully."])


class HealthResponse(BaseModel):
    """Health-check response schema."""

    status: str = Field(default="ok", examples=["ok"])


class ErrorBody(BaseModel):
    """Structured error body for consistent API failures."""

    code: str = Field(..., examples=["EMPLOYEE_NOT_FOUND"])
    message: str = Field(..., examples=["Employee not found."])
    details: dict[str, Any] | None = Field(
        default=None,
        examples=[{"employee_id": "EMP-1001"}],
    )


class ErrorResponse(BaseModel):
    """Top-level error response wrapper."""

    success: bool = Field(default=False)
    error: ErrorBody


"""Employee API request and response schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EmployeeBase(BaseModel):
    """Common employee fields used across request schemas."""

    full_name: str = Field(..., min_length=2, max_length=120, examples=["Aarav Sharma"])
    email: EmailStr = Field(..., examples=["aarav@example.com"])
    department: str = Field(..., min_length=2, max_length=120, examples=["Engineering"])

    model_config = ConfigDict(str_strip_whitespace=True)


class EmployeeCreate(EmployeeBase):
    """Request schema for creating a new employee."""

    employee_id: str = Field(..., min_length=2, max_length=32, examples=["EMP-1001"])


class EmployeeRead(EmployeeBase):
    """Response schema for returning employee data."""

    id: int
    employee_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


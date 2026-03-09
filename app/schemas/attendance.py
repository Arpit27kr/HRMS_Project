"""Attendance API request and response schemas."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.attendance import AttendanceStatus


class AttendanceCreate(BaseModel):
    """Request schema for creating an attendance record."""

    employee_id: str = Field(..., min_length=2, max_length=32, examples=["EMP-1001"])
    attendance_date: date = Field(..., examples=["2026-03-09"])
    status: AttendanceStatus = Field(..., examples=["Present"])

    model_config = ConfigDict(str_strip_whitespace=True)


class AttendanceRead(BaseModel):
    """Response schema for attendance data returned to clients."""

    id: int
    employee_id: str = Field(..., examples=["EMP-1001"])
    attendance_date: date
    status: AttendanceStatus
    created_at: datetime


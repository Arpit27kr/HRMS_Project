"""Attendance API endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.attendance import AttendanceCreate, AttendanceRead
from app.services.attendance_service import AttendanceService

router = APIRouter(prefix="/attendance", tags=["Attendance"])


def get_attendance_service(database_session: Session = Depends(get_db)) -> AttendanceService:
    """Return an attendance service instance scoped to the request."""
    return AttendanceService(database_session=database_session)


@router.post("", response_model=AttendanceRead, status_code=status.HTTP_201_CREATED)
def mark_attendance(
    attendance_payload: AttendanceCreate,
    attendance_service: AttendanceService = Depends(get_attendance_service),
) -> AttendanceRead:
    """Create an attendance record for an employee."""
    return attendance_service.mark_attendance(attendance_payload)


@router.get("/{employee_id}", response_model=list[AttendanceRead], status_code=status.HTTP_200_OK)
def get_attendance_for_employee(
    employee_id: str,
    attendance_service: AttendanceService = Depends(get_attendance_service),
) -> list[AttendanceRead]:
    """List attendance records for one employee."""
    return attendance_service.get_attendance_for_employee(employee_id)


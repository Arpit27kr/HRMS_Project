"""Repository methods for attendance persistence operations."""

from datetime import date

from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate


class AttendanceRepository:
    """Data-access layer for attendance records."""

    def __init__(self, database_session: Session) -> None:
        """Store database session used by repository queries."""
        self.database_session = database_session

    def create_attendance(
        self, employee_database_id: int, attendance_payload: AttendanceCreate
    ) -> Attendance:
        """Create and persist one attendance record."""
        attendance_record = Attendance(
            employee_id=employee_database_id,
            attendance_date=attendance_payload.attendance_date,
            status=attendance_payload.status,
        )
        self.database_session.add(attendance_record)
        self.database_session.commit()
        self.database_session.refresh(attendance_record)
        return attendance_record

    def get_attendance_by_employee_and_date(
        self, employee_database_id: int, attendance_date: date
    ) -> Attendance | None:
        """Fetch attendance for a given employee on one specific date."""
        return (
            self.database_session.query(Attendance)
            .filter(
                Attendance.employee_id == employee_database_id,
                Attendance.attendance_date == attendance_date,
            )
            .first()
        )

    def get_attendance_for_employee(self, employee_database_id: int) -> list[Attendance]:
        """Return all attendance records for an employee, newest date first."""
        return (
            self.database_session.query(Attendance)
            .filter(Attendance.employee_id == employee_database_id)
            .order_by(Attendance.attendance_date.desc())
            .all()
        )


"""Business logic for attendance workflows."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.employee_repository import EmployeeRepository
from app.schemas.attendance import AttendanceCreate, AttendanceRead
from app.utils.exceptions import ConflictException, NotFoundException


class AttendanceService:
    """Service layer for attendance operations."""

    def __init__(self, database_session: Session) -> None:
        """Initialize service dependencies."""
        self.database_session = database_session
        self.employee_repository = EmployeeRepository(database_session)
        self.attendance_repository = AttendanceRepository(database_session)

    def mark_attendance(self, attendance_payload: AttendanceCreate) -> AttendanceRead:
        """Mark attendance for an employee on a specific date."""
        employee = self.employee_repository.get_employee_by_employee_id(
            attendance_payload.employee_id
        )
        if not employee:
            raise NotFoundException(
                code="EMPLOYEE_NOT_FOUND",
                message="Cannot mark attendance. Employee does not exist.",
                details={"employee_id": attendance_payload.employee_id},
            )

        existing_attendance = self.attendance_repository.get_attendance_by_employee_and_date(
            employee_database_id=employee.id,
            attendance_date=attendance_payload.attendance_date,
        )
        if existing_attendance:
            raise ConflictException(
                code="ATTENDANCE_ALREADY_MARKED",
                message="Attendance already exists for this employee on the given date.",
                details={
                    "employee_id": attendance_payload.employee_id,
                    "attendance_date": str(attendance_payload.attendance_date),
                },
            )

        try:
            attendance_record = self.attendance_repository.create_attendance(
                employee_database_id=employee.id,
                attendance_payload=attendance_payload,
            )
        except IntegrityError as exc:
            self.database_session.rollback()
            raise ConflictException(
                code="ATTENDANCE_CONFLICT",
                message="Attendance could not be created due to a data conflict.",
            ) from exc

        return AttendanceRead(
            id=attendance_record.id,
            employee_id=employee.employee_id,
            attendance_date=attendance_record.attendance_date,
            status=attendance_record.status,
            created_at=attendance_record.created_at,
        )

    def get_attendance_for_employee(self, employee_id: str) -> list[AttendanceRead]:
        """Return attendance history for a given employee identifier."""
        employee = self.employee_repository.get_employee_by_employee_id(employee_id)
        if not employee:
            raise NotFoundException(
                code="EMPLOYEE_NOT_FOUND",
                message="Employee not found.",
                details={"employee_id": employee_id},
            )

        attendance_records = self.attendance_repository.get_attendance_for_employee(employee.id)
        return [
            AttendanceRead(
                id=attendance_record.id,
                employee_id=employee.employee_id,
                attendance_date=attendance_record.attendance_date,
                status=attendance_record.status,
                created_at=attendance_record.created_at,
            )
            for attendance_record in attendance_records
        ]


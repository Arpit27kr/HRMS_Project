"""Business logic for employee workflows."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.repositories.employee_repository import EmployeeRepository
from app.schemas.employee import EmployeeCreate
from app.utils.exceptions import ConflictException, NotFoundException


class EmployeeService:
    """Service layer for employee operations."""

    def __init__(self, database_session: Session) -> None:
        """Initialize service dependencies."""
        self.database_session = database_session
        self.employee_repository = EmployeeRepository(database_session)

    def create_employee(self, employee_payload: EmployeeCreate):
        """Create an employee after validating uniqueness constraints."""
        existing_employee = self.employee_repository.get_employee_by_employee_id(
            employee_payload.employee_id
        )
        if existing_employee:
            raise ConflictException(
                code="DUPLICATE_EMPLOYEE_ID",
                message="Employee with this employee_id already exists.",
                details={"employee_id": employee_payload.employee_id},
            )

        try:
            return self.employee_repository.create_employee(employee_payload)
        except IntegrityError as exc:
            self.database_session.rollback()
            raise ConflictException(
                code="EMPLOYEE_CONFLICT",
                message="Employee could not be created due to a data conflict.",
            ) from exc

    def get_all_employees(self):
        """Return all employees."""
        return self.employee_repository.get_all_employees()

    def get_employee_by_employee_id(self, employee_id: str):
        """Return one employee by business identifier or raise not found."""
        employee = self.employee_repository.get_employee_by_employee_id(employee_id)
        if not employee:
            raise NotFoundException(
                code="EMPLOYEE_NOT_FOUND",
                message="Employee not found.",
                details={"employee_id": employee_id},
            )
        return employee

    def delete_employee(self, employee_id: str) -> None:
        """Delete one employee by business identifier."""
        employee = self.employee_repository.get_employee_by_employee_id(employee_id)
        if not employee:
            raise NotFoundException(
                code="EMPLOYEE_NOT_FOUND",
                message="Employee not found.",
                details={"employee_id": employee_id},
            )
        self.employee_repository.delete_employee(employee)


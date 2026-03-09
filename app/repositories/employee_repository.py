"""Repository methods for employee persistence operations."""

from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate


class EmployeeRepository:
    """Data-access layer for employee records."""

    def __init__(self, database_session: Session) -> None:
        """Store database session used by repository queries."""
        self.database_session = database_session

    def create_employee(self, employee_payload: EmployeeCreate) -> Employee:
        """Create and persist a new employee row."""
        employee = Employee(
            employee_id=employee_payload.employee_id,
            full_name=employee_payload.full_name,
            email=employee_payload.email,
            department=employee_payload.department,
        )
        self.database_session.add(employee)
        self.database_session.commit()
        self.database_session.refresh(employee)
        return employee

    def get_all_employees(self) -> list[Employee]:
        """Return all employees sorted by creation time descending."""
        return (
            self.database_session.query(Employee)
            .order_by(Employee.created_at.desc())
            .all()
        )

    def get_employee_by_employee_id(self, employee_id: str) -> Employee | None:
        """Fetch one employee by business employee identifier."""
        return (
            self.database_session.query(Employee)
            .filter(Employee.employee_id == employee_id)
            .first()
        )

    def delete_employee(self, employee: Employee) -> None:
        """Delete an employee row and commit the transaction."""
        self.database_session.delete(employee)
        self.database_session.commit()


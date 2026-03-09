"""Employee API endpoints."""

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeRead
from app.services.employee_service import EmployeeService

router = APIRouter(prefix="/employees", tags=["Employees"])


def get_employee_service(database_session: Session = Depends(get_db)) -> EmployeeService:
    """Return an employee service instance scoped to the request."""
    return EmployeeService(database_session=database_session)


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(
    employee_payload: EmployeeCreate,
    employee_service: EmployeeService = Depends(get_employee_service),
) -> EmployeeRead:
    """Create a new employee."""
    return employee_service.create_employee(employee_payload)


@router.get("", response_model=list[EmployeeRead], status_code=status.HTTP_200_OK)
def get_all_employees(
    employee_service: EmployeeService = Depends(get_employee_service),
) -> list[EmployeeRead]:
    """List all employees."""
    return employee_service.get_all_employees()


@router.get("/{employee_id}", response_model=EmployeeRead, status_code=status.HTTP_200_OK)
def get_employee(
    employee_id: str,
    employee_service: EmployeeService = Depends(get_employee_service),
) -> EmployeeRead:
    """Get one employee by business identifier."""
    return employee_service.get_employee_by_employee_id(employee_id)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: str,
    employee_service: EmployeeService = Depends(get_employee_service),
) -> Response:
    """Delete one employee and all related attendance records."""
    employee_service.delete_employee(employee_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


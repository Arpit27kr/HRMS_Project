"""Custom application exceptions with API-friendly metadata."""

from typing import Any


class APIException(Exception):
    """Base exception for controlled API error responses."""

    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: dict[str, Any] | None = None,
    ) -> None:
        """Initialize exception payload used by global handlers."""
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details
        super().__init__(message)


class BadRequestException(APIException):
    """Exception for malformed or invalid client requests."""

    def __init__(self, code: str, message: str, details: dict[str, Any] | None = None) -> None:
        """Create a 400 Bad Request error."""
        super().__init__(status_code=400, code=code, message=message, details=details)


class NotFoundException(APIException):
    """Exception for resources that do not exist."""

    def __init__(self, code: str, message: str, details: dict[str, Any] | None = None) -> None:
        """Create a 404 Not Found error."""
        super().__init__(status_code=404, code=code, message=message, details=details)


class ConflictException(APIException):
    """Exception for resource state conflicts."""

    def __init__(self, code: str, message: str, details: dict[str, Any] | None = None) -> None:
        """Create a 409 Conflict error."""
        super().__init__(status_code=409, code=code, message=message, details=details)


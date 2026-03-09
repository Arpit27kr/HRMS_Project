# HRMS Project

HRMS Project is a full-stack employee and attendance management application.

## Functionality

### Backend (FastAPI)
- Add a new employee
- View all employees
- View one employee by `employee_id`
- Delete an employee
- Mark attendance for an employee by date
- View attendance records for an employee
- Server-side validation for required fields and email format
- Duplicate employee ID protection
- Consistent JSON error responses

### Frontend (Vite + React)
- Dashboard with backend status check
- Employee management UI
- Attendance management UI
- API integration with backend through environment-based base URL

## Tech Stack
- Python 3.12
- FastAPI
- SQLAlchemy ORM
- SQLite (local development)
- React + Vite

## Repository Structure

```text
app/                 # Backend source
frontend/            # Frontend source
requirements.txt     # Backend dependencies
server.py            # Backend Vercel entrypoint
```

## Run Locally

### 1) Backend

From repository root:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URLs:
- API Root: `http://127.0.0.1:8000/`
- Docs: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`

### 2) Frontend

From `frontend` folder:

```bash
npm install
npm run dev
```

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Frontend URL:
- `http://localhost:5173`

## API Endpoints

- `POST /api/v1/employees`
- `GET /api/v1/employees`
- `GET /api/v1/employees/{employee_id}`
- `DELETE /api/v1/employees/{employee_id}`
- `POST /api/v1/attendance`
- `GET /api/v1/attendance/{employee_id}`
- `GET /health`

## Deployment Notes (Vercel)

### Backend project
- Root directory: repository root
- Install command: `pip install -r requirements.txt`
- Required environment variables:
  - `CORS_ORIGINS`
  - `DATABASE_URL` (recommended for production persistence)

### Frontend project
- Root directory: `frontend`
- Required environment variable:
  - `VITE_API_BASE_URL=https://<your-backend-domain>.vercel.app`


import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { useEmployees } from '../hooks/useEmployees';
import { checkHealth } from '../services/attendanceService';
import { DASHBOARD_ROUTES } from '../utils/constants';
import './DashboardPage.css';

function DashboardPage() {
  const { employees, totalEmployees, isLoading, errorMessage } = useEmployees();
  const [healthStatus, setHealthStatus] = useState('checking');

  useEffect(() => {
    let isActive = true;

    async function fetchHealth() {
      try {
        await checkHealth();
        if (isActive) {
          setHealthStatus('online');
        }
      } catch {
        if (isActive) {
          setHealthStatus('offline');
        }
      }
    }

    fetchHealth();

    return () => {
      isActive = false;
    };
  }, []);

  const departmentCount = useMemo(() => {
    const departments = new Set(employees.map((employee) => employee.department).filter(Boolean));
    return departments.size;
  }, [employees]);

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Overview of employees and quick links for day-to-day HR operations."
    >
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}

      <section className="dashboard-summary-grid" aria-label="Summary cards">
        <article className="dashboard-card">
          <p className="dashboard-card__label">Total Employees</p>
          <h3 className="dashboard-card__value">{isLoading ? '-' : totalEmployees}</h3>
          {isLoading ? <Loader label="Fetching employees" /> : null}
        </article>

        <article className="dashboard-card">
          <p className="dashboard-card__label">Departments</p>
          <h3 className="dashboard-card__value">{isLoading ? '-' : departmentCount}</h3>
          <p className="dashboard-card__hint">Based on employee records</p>
        </article>

        <article className="dashboard-card">
          <p className="dashboard-card__label">Backend Status</p>
          <h3 className="dashboard-card__value">
            {healthStatus === 'checking' ? 'Checking' : healthStatus === 'online' ? 'Online' : 'Offline'}
          </h3>
          <span
            className={`status-chip-small ${
              healthStatus === 'online'
                ? 'status-chip-small--online'
                : healthStatus === 'offline'
                ? 'status-chip-small--offline'
                : 'status-chip-small--checking'
            }`.trim()}
          >
            {healthStatus}
          </span>
        </article>
      </section>

      <section className="dashboard-actions-grid" aria-label="Quick actions">
        {DASHBOARD_ROUTES.map((route) => (
          <article className="dashboard-action-card" key={route.path}>
            <h3 className="dashboard-action-card__title">{route.title}</h3>
            <p className="dashboard-action-card__description">{route.description}</p>
            <Link className="dashboard-action-card__link" to={route.path}>
              {route.ctaLabel}
            </Link>
          </article>
        ))}
      </section>
    </PageContainer>
  );
}

export default DashboardPage;

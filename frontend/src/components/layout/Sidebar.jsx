import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, onNavigate }) {
  const sidebarClassName = `app-sidebar ${isOpen ? 'app-sidebar--open' : ''}`.trim();

  return (
    <aside className={sidebarClassName}>
      <div className="app-sidebar__brand">HRMS</div>
      <nav className="app-sidebar__nav" aria-label="Main navigation">
        <NavLink to="/" className="app-sidebar__link" onClick={onNavigate} end>
          Dashboard
        </NavLink>
        <NavLink to="/employees" className="app-sidebar__link" onClick={onNavigate}>
          Employees
        </NavLink>
        <NavLink to="/attendance" className="app-sidebar__link" onClick={onNavigate}>
          Attendance
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;

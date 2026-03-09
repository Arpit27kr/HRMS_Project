import './Header.css';

function Header({ onToggleSidebar }) {
  return (
    <header className="app-header">
      <button
        className="app-header__menu-button"
        type="button"
        aria-label="Toggle navigation"
        onClick={onToggleSidebar}
      >
        ☰
      </button>
      <div>
        <h1 className="app-header__title">HRMS Lite</h1>
        <p className="app-header__subtitle">Employee and attendance management</p>
      </div>
    </header>
  );
}

export default Header;

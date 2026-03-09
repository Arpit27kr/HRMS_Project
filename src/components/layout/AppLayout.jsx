import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './AppLayout.css';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((previousState) => !previousState);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onNavigate={handleCloseSidebar} />
      <div className="app-layout__content-wrap">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="app-layout__main" onClick={handleCloseSidebar}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;

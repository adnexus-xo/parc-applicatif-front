import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-16 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
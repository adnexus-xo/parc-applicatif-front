import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AppWindow,
  GitFork,
  Users,
  FileText,
  Settings,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function Sidebar() {
  const { isAdmin } = useAuth();

  const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/' },
    { label: 'Applications', icon: AppWindow, path: '/applications' },
    { label: 'Dépendances', icon: GitFork, path: '/dependances' },
    ...(isAdmin ? [{ label: 'Utilisateurs', icon: Users, path: '/utilisateurs' }] : []),
    { label: 'Rapports', icon: FileText, path: '/rapports' },
    { label: 'Paramètres', icon: Settings, path: '/parametres' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-68 bg-[#0D1B6E] flex flex-col z-50">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-white text-3xl font-bold tracking-tight">
          Parc<span className="text-[#FFD100]">App</span>
        </h1>
        <h2 className="text-[#FFD100] text-base mt-1">IT Factory</h2>
      </div>

      <nav className="flex-1 px-1 py-8 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#FFD100] text-[#0D1B6E]'
                  : 'text-white/100 hover:text-white hover:bg-white/8'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-8 py-6 border-t border-white/10">
        <p className="text-[#FFD100] text-base">YAS SENEGAL 2026</p>
      </div>
    </aside>
  );
}

export default Sidebar;
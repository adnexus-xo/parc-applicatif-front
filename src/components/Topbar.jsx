import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut } from 'lucide-react';

function Topbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-40">
      <div></div>
      

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFD100] rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 pl-4 border-l border-gray-200"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFD100] flex items-center justify-center">
              <span className="text-[#0D1B6E] text-xs font-semibold">
                {user.prenomUtilisateur?.[0]}{user.nomUtilisateur?.[0]}
              </span>
            </div>
            <div className=" text-left">
              <p className="text-base font-medium text-black-900">
                {user.prenomUtilisateur} {user.nomUtilisateur}
              </p>
              <p className="text-xs text-black-900">{user.role}</p>
            </div>
            <ChevronDown size={14} className="text-black-900" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-xl shadow-lg w-48 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-base text-[#0D1B6E] hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={15} />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
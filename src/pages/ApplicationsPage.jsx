import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filterEtat, setFilterEtat] = useState('');
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/applications').then((res) => setApplications(res.data));
  }, []);

  
  const filtered = applications.filter((app) => {
  const matchSearch = app.nomApplication.toLowerCase().includes(search.toLowerCase());
  const matchEtat = filterEtat ? app.etat === filterEtat : true;
  return matchSearch && matchEtat;
});

  return (
    <div className="space-y-6">
      <div className="flex justify-center mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4">
        <div className="relative flex-1">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder="Rechercher une application..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="text-sm text-black-500 font-medium mb-3 w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100] transition-all"
    />
  </div>
        <select
          value={filterEtat}
          onChange={(e) => setFilterEtat(e.target.value)}
          className="px-4 py-2 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100]"
        >
          <option value="">Tous les états</option>
          <option value="En projet">En projet</option>
          <option value="En service">En service</option>
          <option value="Obsolète">Obsolète</option>
          <option value="A décommissionner">À décommissionner</option>
          <option value="Retirée">Retirée</option>
          <option value="Abandonnée">Abandonnée</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0D1B6E] border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Nom</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Version</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">État</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Criticité</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Catégorie</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                  Aucune application trouvée
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr key={app.idApplication} className={`transition-colors ${ app.etat === 'Obsolète' ? 'bg-orange-50 hover:bg-orange-100' :app.etat === 'A décommissionner' ? 'bg-red-50 hover:bg-red-100' :'hover:bg-[#F8FAFC]'}`}>                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{app.nomApplication}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{app.version}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{app.etat}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{app.criticite}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {app.categorie?.nomCategorie || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => navigate(`/applications/${app.idApplication}`)}
                      className="text-[#0D1B6E] text-sm hover:underline font-medium">
                      Voir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-gray-900 text-sm text-right mt-2">
        {filtered.length} application(s) enregistrée(s)
      </p>

    
      {canEdit && (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => navigate('/applications/new')}
      className="flex items-center gap-2 bg-[#FFD100] text-[#0D1B6E] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#E6BC00] transition-colors"
    >
      <Plus size={16} />
      Ajouter une application
    </button>
  </div>
)}
    </div>
  );
}

export default ApplicationsPage;
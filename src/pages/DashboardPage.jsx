import { useEffect, useState } from 'react';
import { AppWindow, AlertTriangle, Users, GitFork } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const COLORS = ['#0D1B6E', '#FFD100', '#065F46', '#7C3AED', '#DC2626', '#D97706'];

function DashboardPage() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    applicationsCritiques: 0,
    totalUtilisateurs: 0,
    totalDependances: 0,
  });
  const [byEtat, setByEtat] = useState([]);
  const [byCriticite, setByCriticite] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [byEquipe, setByEquipe] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [statsAvancees, setStatsAvancees] = useState({
    enService: 0,
    obsoletes: 0,
    enProjet: 0,
    aDecommissionner: 0,
  });
  const { isLecteur } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apps, users, deps] = await Promise.all([
          api.get('/applications'),
          api.get('/utilisateurs'),
          api.get('/dependdes'),
        ]);

        const critiques = apps.data.filter((app) => app.criticite === 'Vitale');

        setStats({
          totalApplications: apps.data.length,
          applicationsCritiques: critiques.length,
          totalUtilisateurs: users.data.length,
          totalDependances: deps.data.length,
        });

        const etatCount = {};
        apps.data.forEach((app) => {
          etatCount[app.etat] = (etatCount[app.etat] || 0) + 1;
        });
        setByEtat(Object.entries(etatCount).map(([name, value]) => ({ name, value })));

        const criticiteCount = {};
        apps.data.forEach((app) => {
          criticiteCount[app.criticite] = (criticiteCount[app.criticite] || 0) + 1;
        });
        setByCriticite(Object.entries(criticiteCount).map(([name, value]) => ({ name, value })));

        setRecentApps(apps.data.slice(0, 5));

        const listeAlertes = [];
        apps.data.forEach((app) => {
          if (app.etat === 'Obsolète') {
            listeAlertes.push({ type: 'warning', message: `${app.nomApplication} est obsolète` });
          }
          if (app.etat === 'A décommissionner') {
            listeAlertes.push({ type: 'danger', message: `${app.nomApplication} est à décommissionner` });
          }
          if (app.criticite === 'Vitale' && !app.dateMiseEnService) {
            listeAlertes.push({ type: 'info', message: `${app.nomApplication} est vitale mais sans date de mise en service` });
          }
        });
        setAlertes(listeAlertes);

        setStatsAvancees({
          enService: apps.data.filter(a => a.etat === 'En service').length,
          obsoletes: apps.data.filter(a => a.etat === 'Obsolète').length,
          enProjet: apps.data.filter(a => a.etat === 'En projet').length,
          aDecommissionner: apps.data.filter(a => a.etat === 'A décommissionner').length,
        });

        const equipeCount = {};
        apps.data.forEach((app) => {
          const nomEquipe = app.equipeUtilisatrice?.nomEquipe || 'Non assignée';
          equipeCount[nomEquipe] = (equipeCount[nomEquipe] || 0) + 1;
        });
        setByEquipe(Object.entries(equipeCount).map(([name, value]) => ({ name, value })));

      } catch (error) {
        console.error('Erreur lors du chargement des stats', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Applications', value: stats.totalApplications },
    { label: 'Applications Critiques', value: stats.applicationsCritiques },
    { label: 'Utilisateurs', value: stats.totalUtilisateurs },
    { label: 'Dépendances', value: stats.totalDependances },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="flex justify-center mt-4 text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <h2 className="flex justify-center mt-4 text-sm text-black-500 font-medium mb-3">Overview</h2>
      </div>

      {/* Cartes principales */}
      <div className="grid grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border-l-4 border-l-[#FFD100] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-black-500 font-medium mb-3">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chiffres de synthèse par état */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border-l-4 border-l-emerald-500 border border-gray-100 shadow-sm">
          <p className="text-sm text-black-500 font-medium mb-3">En service</p>
          <p className="text-3xl font-bold text-gray-900">{statsAvancees.enService}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-l-blue-500 border border-gray-100 shadow-sm">
          <p className="text-sm text-black-500 font-medium mb-3">En projet</p>
          <p className="text-3xl font-bold text-gray-900">{statsAvancees.enProjet}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-l-orange-500 border border-gray-100 shadow-sm">
          <p className="text-sm text-black-500 font-medium mb-3">Obsolètes</p>
          <p className="text-3xl font-bold text-gray-900">{statsAvancees.obsoletes}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border-l-4 border-l-red-500 border border-gray-100 shadow-sm">
          <p className="text-sm text-black-500 font-medium mb-3">À décommissionner</p>
          <p className="text-3xl font-bold text-gray-900">{statsAvancees.aDecommissionner}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Répartition par état</h2>
          {byEtat.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">Aucune donnée disponible</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={byEtat} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {byEtat.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Répartition par criticité</h2>
          {byCriticite.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">Aucune donnée disponible</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byCriticite}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0D1B6E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Répartition par équipe */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Répartition par équipe utilisatrice</h2>
        {byEquipe.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">Aucune donnée disponible</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byEquipe}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#FFD100" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Applications récentes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Applications récentes</h2>
          <a href="/applications" className="text-sm text-[#0D1B6E] hover:underline font-medium">Voir tout</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0D1B6E]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Nom</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Version</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">État</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Criticité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400 text-sm">Aucune application enregistrée</td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.idApplication} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-800">{app.nomApplication}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{app.version}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{app.etat}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{app.criticite}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertes */}
      {!isLecteur && alertes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">⚠️ Alertes</h2>
          </div>
          <div className="p-5 space-y-3">
            {alertes.map((alerte, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  alerte.type === 'danger' ? 'bg-red-50 text-red-700' :
                  alerte.type === 'warning' ? 'bg-orange-50 text-orange-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                <span>{alerte.type === 'danger' ? '🔴' : alerte.type === 'warning' ? '🟡' : '🔵'}</span>
                {alerte.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
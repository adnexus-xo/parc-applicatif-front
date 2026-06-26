import { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Plus, Search } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

function DependancesPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [allDeps, setAllDeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    idApplicationSource: '',
    idApplicationCible: '',
    typeDependance: '',
    descriptionDependance: '',
  });
  const graphRef = useRef();
  const { canEdit } = useAuth();

  const fetchData = async () => {
    try {
      const [apps, deps] = await Promise.all([
        api.get('/applications'),
        api.get('/dependdes'),
      ]);
      setApplications(apps.data);
      setAllDeps(deps.data);
      buildGraph(apps.data, deps.data, null);
    } catch (error) {
      console.error('Erreur chargement dépendances', error);
    } finally {
      setLoading(false);
    }
  };

  const buildGraph = (apps, deps, selectedId) => {
    if (!selectedId) {
      // Affiche tout
      const nodes = apps.map((app) => ({
        id: app.idApplication,
        name: app.nomApplication,
        etat: app.etat,
        criticite: app.criticite,
      }));
      const links = deps.map((dep) => ({
        source: dep.id.idApplicationSource,
        target: dep.id.idApplicationCible,
        type: dep.typeDependance,
      }));
      setGraphData({ nodes, links });
    } else {
      // Filtre sur l'app sélectionnée et ses voisins directs
      const relatedDeps = deps.filter(
        (dep) =>
          dep.id.idApplicationSource === selectedId ||
          dep.id.idApplicationCible === selectedId
      );
      const relatedIds = new Set([selectedId]);
      relatedDeps.forEach((dep) => {
        relatedIds.add(dep.id.idApplicationSource);
        relatedIds.add(dep.id.idApplicationCible);
      });
      const nodes = apps
        .filter((app) => relatedIds.has(app.idApplication))
        .map((app) => ({
          id: app.idApplication,
          name: app.nomApplication,
          etat: app.etat,
          criticite: app.criticite,
          selected: app.idApplication === selectedId,
        }));
      const links = relatedDeps.map((dep) => ({
        source: dep.id.idApplicationSource,
        target: dep.id.idApplicationCible,
        type: dep.typeDependance,
      }));
      setGraphData({ nodes, links });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectApp = (app) => {
    if (selectedApp?.idApplication === app.idApplication) {
      setSelectedApp(null);
      buildGraph(applications, allDeps, null);
    } else {
      setSelectedApp(app);
      buildGraph(applications, allDeps, app.idApplication);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dependdes', {
        idApplicationSource: parseInt(form.idApplicationSource),
        idApplicationCible: parseInt(form.idApplicationCible),
        typeDependance: form.typeDependance,
        descriptionDependance: form.descriptionDependance,
      });
      setForm({ idApplicationSource: '', idApplicationCible: '', typeDependance: '', descriptionDependance: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Erreur création dépendance', error);
    }
  };

  const getNodeColor = (node) => {
    if (node.selected) return '#FFD100';
    if (node.criticite === 'Vitale') return '#DC2626';
    if (node.criticite === 'Importante') return '#0D1B6E';
    return '#6B7280';
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100] transition-all";

  const filteredApps = applications.filter((app) =>
    app.nomApplication.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">Chargement du graphe...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex justify-center mt-4 text-2xl font-bold text-gray-900">
          Visualisation des dépendances entre applications
        </h1>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Nouvelle dépendance
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Application source *</label>
                <select value={form.idApplicationSource} onChange={(e) => setForm({ ...form, idApplicationSource: e.target.value })} required className={inputClass}>
                  <option value="">Sélectionner une application</option>
                  {applications.map((app) => (
                    <option key={app.idApplication} value={app.idApplication}>{app.nomApplication}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Application cible *</label>
                <select value={form.idApplicationCible} onChange={(e) => setForm({ ...form, idApplicationCible: e.target.value })} required className={inputClass}>
                  <option value="">Sélectionner une application</option>
                  {applications.filter(a => a.idApplication !== parseInt(form.idApplicationSource)).map((app) => (
                    <option key={app.idApplication} value={app.idApplication}>{app.nomApplication}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de dépendance *</label>
                <select value={form.typeDependance} onChange={(e) => setForm({ ...form, typeDependance: e.target.value })} required className={inputClass}>
                  <option value="">Sélectionner un type</option>
                  <option value="API">API</option>
                  <option value="Base de données">Base de données</option>
                  <option value="Authentification">Authentification</option>
                  <option value="Fichiers">Fichiers</option>
                  <option value="Messagerie">Messagerie</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input value={form.descriptionDependance} onChange={(e) => setForm({ ...form, descriptionDependance: e.target.value })} className={inputClass} placeholder="Description optionnelle" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#FFD100] text-[#0D1B6E] text-sm font-medium hover:bg-[#E6BC00] transition-colors">
                Créer la dépendance
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Légende */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-6">
        <p className="text-sm font-medium text-gray-600">Légende :</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-sm text-gray-600">Vitale</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#0D1B6E]"></div>
          <span className="text-sm text-gray-600">Importante</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-sm text-gray-600">Secondaire</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FFD100]"></div>
          <span className="text-sm text-gray-600">Sélectionnée</span>
        </div>
      </div>

      {/* Layout liste + graphe */}
      <div className="flex gap-4" style={{ height: '600px' }}>

        {/* Liste des applications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col" style={{ width: '260px', minWidth: '260px' }}>
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-3">Applications</p>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-[#FFD100] transition-all"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {filteredApps.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Aucune application</p>
            ) : (
              filteredApps.map((app) => {
                const isSelected = selectedApp?.idApplication === app.idApplication;
                const hasDep = allDeps.some(
                  (d) => d.id.idApplicationSource === app.idApplication || d.id.idApplicationCible === app.idApplication
                );
                return (
                  <button
                    key={app.idApplication}
                    onClick={() => handleSelectApp(app)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-colors flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#FFD100] text-[#0D1B6E]'
                        : 'hover:bg-[#F8FAFC] text-gray-700'
                    }`}
                  >
                    <span className="text-xs font-medium truncate">{app.nomApplication}</span>
                    {hasDep && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        isSelected ? 'bg-[#0D1B6E] text-white' : 'bg-[#0D1B6E]/10 text-[#0D1B6E]'
                      }`}>
                        dep
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
          {selectedApp && (
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => { setSelectedApp(null); buildGraph(applications, allDeps, null); }}
                className="w-full text-xs text-gray-500 hover:text-[#0D1B6E] transition-colors"
              >
                ✕ Réinitialiser la sélection
              </button>
            </div>
          )}
        </div>

        {/* Graphe */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 relative">
          <div style={{
            position: 'absolute', top: '12px', left: '12px', zIndex: 999,
            backgroundColor: 'white', padding: '6px 12px', borderRadius: '8px',
            border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#0D1B6E', margin: 0 }}>
              {selectedApp ? `Dépendances de : ${selectedApp.nomApplication}` : 'Carte des dépendances'}
            </p>
          </div>

          {graphData.nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">
                {selectedApp ? 'Aucune dépendance pour cette application' : 'Aucune application enregistrée'}
              </p>
            </div>
          ) : (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel="name"
              nodeColor={getNodeColor}
              nodeRelSize={6}
              linkColor={() => '#0D1B6E'}
              linkWidth={2.5}
              linkDirectionalArrowLength={8}
              linkDirectionalArrowRelPos={1}
              linkCanvasObject={(link, ctx, globalScale) => {
                const start = link.source;
                const end = link.target;
                if (typeof start !== 'object' || typeof end !== 'object') return;
                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;
                const fontSize = Math.max(10 / globalScale, 2);
                ctx.font = `${fontSize}px DM Sans`;
                ctx.fillStyle = '#92400E';
                ctx.textAlign = 'center';
                ctx.fillText(link.type || '', midX, midY);
              }}
              linkCanvasObjectMode={() => 'after'}
              linkLabel="type"
              backgroundColor="#F8FAFC"
              d3VelocityDecay={0.3}
              d3AlphaDecay={0.02}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = Math.max(12 / globalScale, 3);
                const radius = node.selected ? 10 : 8;
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = getNodeColor(node);
                ctx.fill();
                ctx.strokeStyle = node.selected ? '#0D1B6E' : 'white';
                ctx.lineWidth = node.selected ? 2.5 : 1.5;
                ctx.stroke();
                ctx.font = `bold ${fontSize}px DM Sans`;
                ctx.fillStyle = '#1F2937';
                ctx.textAlign = 'center';
                ctx.fillText(label, node.x, node.y + radius + fontSize + 2);
              }}
              nodeCanvasObjectMode={() => 'replace'}
              cooldownTicks={100}
              onEngineStop={() => {
                if (graphRef.current) graphRef.current.zoomToFit(400, 80);
              }}
            />
          )}
        </div>
      </div>

      {canEdit && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#FFD100] text-[#0D1B6E] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#E6BC00] transition-colors"
          >
            <Plus size={16} />
            Indiquer une dépendance
          </button>
        </div>
      )}
    </div>
  );
}

export default DependancesPage;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [historique, setHistorique] = useState([]);
  const { canEdit, isLecteur } = useAuth();
  const [showEtatModal, setShowEtatModal] = useState(false);
  const [nouvelEtat, setNouvelEtat] = useState('');
  const [dateMiseEnService, setDateMiseEnService] = useState('');
  const [dateObsolescence, setDateObsolescence] = useState('');

  useEffect(() => {
    api.get(`/applications/${id}`).then((res) => setApp(res.data));
    api.get('/historiques').then((res) => {
      const filtered = res.data.filter((h) => h.application?.idApplication === parseInt(id));
      setHistorique(filtered);
    });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Confirmer la suppression ?')) {
      await api.delete(`/applications/${id}`);
      navigate('/applications');
    }
  };

  const handleChangerEtat = async () => {
    try {
      const payload = {
        ...app,
        etat: nouvelEtat,
        dateMiseEnService: dateMiseEnService || app.dateMiseEnService,
        dateObsolescence: dateObsolescence || app.dateObsolescence,
        dateCreationFiche: app.dateCreationFiche,
      };
      await api.put(`/applications/${id}`, payload);
      setApp({ ...app, etat: nouvelEtat });
      setShowEtatModal(false);
    } catch (error) {
      console.error('Erreur changement état', error);
    }
  };

  if (!app) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">Chargement...</p>
    </div>
  );

  const infoClass = "text-sm text-gray-800 font-medium";
  const labelClass = "text-xs text-gray-400 uppercase tracking-wider mb-1";

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/applications')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{app.nomApplication}</h1>
            <p className="text-gray-500 text-sm mt-1">Version {app.version}</p>
          </div>
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-black-800 mb-5 pb-2 border-b border-gray-100">Informations générales</h2>
        <div className=" text-black grid grid-cols-3 gap-6">
          <div><p className={labelClass}>Nom</p><p className={infoClass}>{app.nomApplication}</p></div>
          <div><p className={labelClass}>Version</p><p className={infoClass}>{app.version}</p></div>
          <div><p className={labelClass}>État</p><p className={infoClass}>{app.etat}</p></div>
          <div><p className={labelClass}>Criticité</p><p className={infoClass}>{app.criticite}</p></div>
          <div><p className={labelClass}>Catégorie</p><p className={infoClass}>{app.categorie?.nomCategorie || '—'}</p></div>
          <div><p className={labelClass}>Date de création</p><p className={infoClass}>{app.dateCreationFiche?.split('T')[0] || '—'}</p></div>
          <div><p className={labelClass}>Date de mise en service</p><p className={infoClass}>{app.dateMiseEnService || '—'}</p></div>
          <div><p className={labelClass}>Date d'obsolescence</p><p className={infoClass}>{app.dateObsolescence || '—'}</p></div>
          <div className="col-span-3"><p className={labelClass}>Description</p><p className="text-sm text-black-700 leading-relaxed">{app.description}</p></div>
        </div>
      </div>

      {/* Boutons d'action */}
      {canEdit && (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate(`/applications/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D1B6E] text-white text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Edit size={15} />
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            <Trash2 size={15} />
            Retirer
          </button>
          <button
            onClick={() => { setNouvelEtat(app.etat); setShowEtatModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD100] text-[#0D1B6E] text-sm font-medium hover:bg-[#E6BC00] transition-colors"
          >
            Changer l'état
          </button>
        </div>
      )}

      {/* Équipes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-black-800 mb-5 pb-2 border-b border-gray-100">Équipes</h2>
        <div className="grid grid-cols-2 gap-6">
          <div><p className={labelClass}>Équipe utilisatrice</p><p className={infoClass}>{app.equipeUtilisatrice?.nomEquipe || '—'}</p></div>
          <div><p className={labelClass}>Équipe responsable</p><p className={infoClass}>{app.equipeResponsable?.nomEquipe || '—'}</p></div>
        </div>
      </div>

      {/* Historique */}
      {!isLecteur && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-black-800">Historique des changements d'état</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0D1B6E]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Application</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Ancien état</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Nouvel état</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Modifié par</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historique.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-black-400 text-sm">Aucun historique disponible</td>
                  </tr>
                ) : (
                  historique.map((h) => (
                    <tr key={h.idHistorique} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3 text-sm text-black-600">{app.nomApplication}</td>
                      <td className="px-5 py-3 text-sm text-black-600">{h.ancienEtat}</td>
                      <td className="px-5 py-3 text-sm text-black-600">{h.nouvelEtat}</td>
                      <td className="px-5 py-3 text-sm text-black-600">{h.dateChangementEtat?.split('T')[0]}</td>
                      <td className="px-5 py-3 text-sm text-black-600">{h.utilisateur?.nomUtilisateur} {h.utilisateur?.prenomUtilisateur}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal changement d'état */}
      {showEtatModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-black-900 mb-4">Changer l'état de l'application</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black-700 mb-1.5">Nouvel état *</label>
                <select
                  value={nouvelEtat}
                  onChange={(e) => setNouvelEtat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100]"
                >
                  <option value="En projet">En projet</option>
                  <option value="En service">En service</option>
                  <option value="Obsolète">Obsolète</option>
                  <option value="A décommissionner">À décommissionner</option>
                  <option value="Retirée">Retirée</option>
                  <option value="Abandonnée">Abandonnée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700 mb-1.5">Date de mise en service</label>
                <input
                  type="date"
                  value={dateMiseEnService}
                  onChange={(e) => setDateMiseEnService(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700 mb-1.5">Date d'obsolescence</label>
                <input
                  type="date"
                  value={dateObsolescence}
                  onChange={(e) => setDateObsolescence(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEtatModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleChangerEtat}
                className="px-5 py-2.5 rounded-xl bg-[#FFD100] text-[#0D1B6E] text-sm font-medium hover:bg-[#E6BC00] transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationDetailPage;
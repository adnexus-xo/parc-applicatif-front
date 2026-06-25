import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

function ParametresPage() {
  const { user, isLecteur, canEdit } = useAuth();
  const [equipes, setEquipes] = useState([]);
  const [editEquipe, setEditEquipe] = useState(null);
  const [editEquipeNom, setEditEquipeNom] = useState('');
  const [categories, setCategories] = useState([]);
  const [nouvelleEquipe, setNouvelleEquipe] = useState('');
  const [nouvelleCategorie, setNouvelleCategorie] = useState({ nom: '', description: '' });
  const [editCategorie, setEditCategorie] = useState(null);
  const [editCategorieNom, setEditCategorieNom] = useState('');
  const [editCategorieDesc, setEditCategorieDesc] = useState('');
  const [profil, setProfil] = useState({
    nomUtilisateur: user.nomUtilisateur || '',
    prenomUtilisateur: user.prenomUtilisateur || '',
    email: user.email || '',
    motDePasse: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (canEdit) {
      api.get('/equipes').then((res) => setEquipes(res.data));
      api.get('/categories').then((res) => setCategories(res.data));
    }
  }, [canEdit]);

  const handleSaveProfil = async () => {
    try {
      const payload = {
        ...user,
        nomUtilisateur: profil.nomUtilisateur,
        prenomUtilisateur: profil.prenomUtilisateur,
        email: profil.email,
        motDePasse: profil.motDePasse || user.motDePasse,
      };
      await api.put(`/utilisateurs/${user.idUtilisateur}`, payload);
      localStorage.setItem('user', JSON.stringify({ ...user, ...payload }));
      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur mise à jour profil', error);
    }
  };

  const handleAddEquipe = async () => {
    if (!nouvelleEquipe.trim()) return;
    try {
      const res = await api.post('/equipes', { nomEquipe: nouvelleEquipe });
      setEquipes([...equipes, res.data]);
      setNouvelleEquipe('');
    } catch (error) {
      console.error('Erreur ajout équipe', error);
    }
  };

  const handleDeleteEquipe = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      await api.delete(`/equipes/${id}`);
      setEquipes(equipes.filter((e) => e.idEquipe !== id));
    }
  };

  const handleEditEquipe = async (equipe) => {
  try {
    await api.put(`/equipes/${equipe.idEquipe}`, { ...equipe, nomEquipe: editEquipeNom });
    setEquipes(equipes.map((e) => e.idEquipe === equipe.idEquipe ? { ...e, nomEquipe: editEquipeNom } : e));
    setEditEquipe(null);
  } catch (error) {
    console.error('Erreur modification équipe', error);
  }
  };

  const handleAddCategorie = async () => {
    if (!nouvelleCategorie.nom.trim()) return;
    try {
      const res = await api.post('/categories', {
        nomCategorie: nouvelleCategorie.nom,
        descriptionCategorie: nouvelleCategorie.description,
      });
      setCategories([...categories, res.data]);
      setNouvelleCategorie({ nom: '', description: '' });
    } catch (error) {
      console.error('Erreur ajout catégorie', error);
    }
  };

  const handleDeleteCategorie = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c.idCategorie !== id));
    }
  };

  const handleEditCategorie = async (cat) => {
  try {
    await api.put(`/categories/${cat.idCategorie}`, {
      ...cat,
      nomCategorie: editCategorieNom,
      descriptionCategorie: editCategorieDesc,
    });
    setCategories(categories.map((c) =>
      c.idCategorie === cat.idCategorie
        ? { ...c, nomCategorie: editCategorieNom, descriptionCategorie: editCategorieDesc }
        : c
    ));
    setEditCategorie(null);
  } catch (error) {
    console.error('Erreur modification catégorie', error);
  }
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100] transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex justify-center mt-4 text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-[#0D1B6E] text-2xl mt-2 font-medium">Gérez vos préférences et configurations</p>
      </div>

      {/* Message succès */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ {successMessage}
        </div>
      )}

      {/* Profil */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Mon profil</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom</label>
            <input
              value={profil.nomUtilisateur}
              onChange={(e) => setProfil({ ...profil, nomUtilisateur: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Prénom</label>
            <input
              value={profil.prenomUtilisateur}
              onChange={(e) => setProfil({ ...profil, prenomUtilisateur: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={profil.email}
              onChange={(e) => setProfil({ ...profil, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Nouveau mot de passe</label>
            <input
              type="password"
              value={profil.motDePasse}
              onChange={(e) => setProfil({ ...profil, motDePasse: e.target.value })}
              className={inputClass}
              placeholder="Laisser vide pour ne pas changer"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveProfil}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFD100] text-[#0D1B6E] rounded-xl text-sm font-medium hover:bg-[#E6BC00] transition-colors"
          >
            <Save size={15} />
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Gestion équipes - Support et Admin uniquement */}
      {canEdit && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Gestion des équipes</h2>
          
          <div className="flex gap-3 mb-4">
            <input
              value={nouvelleEquipe}
              onChange={(e) => setNouvelleEquipe(e.target.value)}
              placeholder="Nom de l'équipe"
              className={inputClass}
            />
            <button
              onClick={handleAddEquipe}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FFD100] text-[#0D1B6E] rounded-xl text-sm font-medium hover:bg-[#E6BC00] transition-colors whitespace-nowrap"
            >
              <Plus size={15} />
              Ajouter
            </button>
          </div>

          <div className="space-y-2">
  {equipes.map((equipe) => (
    <div key={equipe.idEquipe} className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] rounded-xl">
      {editEquipe === equipe.idEquipe ? (
        <input
          value={editEquipeNom}
          onChange={(e) => setEditEquipeNom(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm mr-3"
        />
      ) : (
        <span className="text-sm text-gray-700 font-medium">{equipe.nomEquipe}</span>
      )}
      <div className="flex items-center gap-2">
        {editEquipe === equipe.idEquipe ? (
          <>
            <button onClick={() => handleEditEquipe(equipe)} className="text-emerald-500 hover:text-emerald-700 text-xs font-medium">Sauvegarder</button>
            <button onClick={() => setEditEquipe(null)} className="text-gray-400 hover:text-gray-600 text-xs font-medium">Annuler</button>
          </>
        ) : (
          <>
            <button onClick={() => { setEditEquipe(equipe.idEquipe); setEditEquipeNom(equipe.nomEquipe); }} className="text-[#0D1B6E] hover:text-[#FFD100] transition-colors text-xs font-medium">Modifier</button>
            <button onClick={() => handleDeleteEquipe(equipe.idEquipe)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
          </>
        )}
      </div>
    </div>
  ))}
  </div>
        </div>
      )}

      {/* Gestion catégories - Support et Admin uniquement */}
      {canEdit && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Gestion des catégories</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              value={nouvelleCategorie.nom}
              onChange={(e) => setNouvelleCategorie({ ...nouvelleCategorie, nom: e.target.value })}
              placeholder="Nom de la catégorie"
              className={inputClass}
            />
            <input
              value={nouvelleCategorie.description}
              onChange={(e) => setNouvelleCategorie({ ...nouvelleCategorie, description: e.target.value })}
              placeholder="Description"
              className={inputClass}
            />
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleAddCategorie}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FFD100] text-[#0D1B6E] rounded-xl text-sm font-medium hover:bg-[#E6BC00] transition-colors"
            >
              <Plus size={15} />
              Ajouter
            </button>
          </div>

          <div className="space-y-2">
  {categories.map((cat) => (
    <div key={cat.idCategorie} className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] rounded-xl">
      {editCategorie === cat.idCategorie ? (
        <div className="flex gap-2 flex-1 mr-3">
          <input
            value={editCategorieNom}
            onChange={(e) => setEditCategorieNom(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
            placeholder="Nom"
          />
          <input
            value={editCategorieDesc}
            onChange={(e) => setEditCategorieDesc(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
            placeholder="Description"
          />
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-700 font-medium">{cat.nomCategorie}</p>
          <p className="text-xs text-gray-400">{cat.descriptionCategorie}</p>
        </div>
      )}
      <div className="flex items-center gap-2">
        {editCategorie === cat.idCategorie ? (
          <>
            <button onClick={() => handleEditCategorie(cat)} className="text-emerald-500 hover:text-emerald-700 text-xs font-medium">Sauvegarder</button>
            <button onClick={() => setEditCategorie(null)} className="text-gray-400 hover:text-gray-600 text-xs font-medium">Annuler</button>
          </>
        ) : (
          <>
            <button
              onClick={() => { setEditCategorie(cat.idCategorie); setEditCategorieNom(cat.nomCategorie); setEditCategorieDesc(cat.descriptionCategorie); }}
              className="text-[#0D1B6E] hover:text-[#FFD100] transition-colors text-xs font-medium"
            >
              Modifier
            </button>
            <button onClick={() => handleDeleteCategorie(cat.idCategorie)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  ))}
  </div>
        </div>
      )}
    </div>
  );
}

export default ParametresPage;
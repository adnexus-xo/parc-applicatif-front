import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

function UsersPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nomUtilisateur: '',
    prenomUtilisateur: '',
    email: '',
    motDePasse: '',
    role: '',
    equipe: { idEquipe: '' },
  });
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    api.get('/utilisateurs').then((res) => setUtilisateurs(res.data));
    api.get('/equipes').then((res) => setEquipes(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'idEquipe') {
      setForm({ ...form, equipe: { idEquipe: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/utilisateurs', form);
    setUtilisateurs([...utilisateurs, res.data]);
    setForm({ 
      nomUtilisateur: '', 
      prenomUtilisateur: '', 
      email: '', 
      motDePasse: '', 
      role: '', 
      equipe: { idEquipe: '' } 
    });
    setShowForm(false);
  } catch (error) {
    console.error('Erreur lors de la création', error);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      await api.delete(`/utilisateurs/${id}`);
      setUtilisateurs(utilisateurs.filter((u) => u.idUtilisateur !== id));
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100] transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className=" flex justify-center mt-4 text-2xl font-bold text-gray-900">Utilisateurs</h1>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Nouvel utilisateur
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nom *</label>
                <input name="nomUtilisateur" value={form.nomUtilisateur} onChange={handleChange} required className={inputClass} placeholder="Nom" />
              </div>
              <div>
                <label className={labelClass}>Prénom *</label>
                <input name="prenomUtilisateur" value={form.prenomUtilisateur} onChange={handleChange} required className={inputClass} placeholder="Prénom" />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" name="email" autoComplete="off" value={form.email} onChange={handleChange} required className={inputClass} placeholder="email@yas.sn" />
              </div>
              <div>
                <label className={labelClass}>Mot de passe *</label>
                <input type="password" name="motDePasse" autoComplete="new-password" value={form.motDePasse} onChange={handleChange} required className={inputClass} placeholder="••••••••" />
              </div>
              <div>
                <label className={labelClass}>Rôle *</label>
                <select name="role" value={form.role} onChange={handleChange} required className={inputClass} style={{color: form.role === '' ? '#9CA3AF' : '#374151'}}>
                <option value="" style={{color: '#9CA3AF'}}>Sélectionner un rôle</option>
                <option value="Administrateur" style={{color: '#374151'}}>Administrateur</option>
                <option value="Support" style={{color: '#374151'}}>Support</option>
                <option value="Lecteur" style={{color: '#374151'}}>Lecteur</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Équipe</label>
                <select name="idEquipe" value={form.equipe.idEquipe} onChange={handleChange} className={inputClass} style={{color: !form.equipe.idEquipe ? '#9CA3AF' : '#374151'}}>
                  <option value="">Sélectionner une équipe</option>
                  {equipes.map((eq) => (
                    <option key={eq.idEquipe} value={eq.idEquipe}>{eq.nomEquipe}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#FFD100] text-[#0D1B6E] text-sm font-medium hover:bg-[#E6BC00] transition-colors">
                Créer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0D1B6E]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Nom</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Prénom</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Rôle</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Équipe</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            
            {utilisateurs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                  Aucun utilisateur enregistré
                </td>
              </tr>
            ) : (
              utilisateurs.map((u) => (
                <tr key={u.idUtilisateur} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{u.nomUtilisateur}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{u.prenomUtilisateur}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{u.role}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{u.equipe?.nomEquipe || '—'}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleDelete(u.idUtilisateur)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-gray-900 text-sm text-right mt-2">
  {utilisateurs.length} utilisateur(s) enregistré(s)
</p>

<div className="flex justify-center mt-4">
  <button
    onClick={() => setShowForm(!showForm)}
    className="flex items-center gap-2 bg-[#FFD100] text-[#0D1B6E] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#E6BC00] transition-colors"
  >
    <Plus size={16} />
    Ajouter un utilisateur
  </button>
</div>
    </div>
  );
}

export default UsersPage;
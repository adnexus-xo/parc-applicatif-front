import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ApplicationFormPage() {
  const navigate = useNavigate();
  const [equipes, setEquipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nomApplication: '',
    description: '',
    version: '',
    etat: '',
    criticite: '',
    dateCreationFiche: '',
    dateMiseEnService: '',
    dateObsolescence: '',
    categorie: { idCategorie: '' },
    equipeUtilisatrice: { idEquipe: '' },
    equipeResponsable: { idEquipe: '' },
  });

  useEffect(() => {
    api.get('/equipes').then((res) => setEquipes(res.data));
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'idCategorie') {
      setForm({ ...form, categorie: { idCategorie: value } });
    } else if (name === 'idEquipeUtilisatrice') {
      setForm({ ...form, equipeUtilisatrice: { idEquipe: value } });
    } else if (name === 'idEquipeResponsable') {
      setForm({ ...form, equipeResponsable: { idEquipe: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        dateCreationFiche: form.dateCreationFiche ? `${form.dateCreationFiche}T00:00:00` : null,
        dateMiseEnService: form.dateMiseEnService || null,
        dateObsolescence: form.dateObsolescence || null,
      };
      await api.post('/applications', payload);
      navigate('/applications');
    } catch (error) {
      console.error('Erreur lors de la création', error);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100] transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex justify-center mt-4 text-2xl font-bold text-black-900">Nouvelle application</h1>
        <p className="text-[#0D1B6E] text-2xl mt-1 font-medium">Remplissez les informations de la fiche application</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">

        <div>
          <h2 className="text-base font-semibold text-black-800 mb-4 pb-2 border-b border-gray-100">Informations générales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nom de l'application *</label>
              <input name="nomApplication" value={form.nomApplication} onChange={handleChange} required className={inputClass} placeholder="Ex: Application RH" />
            </div>
            <div>
              <label className={labelClass}>Version *</label>
              <input name="version" value={form.version} onChange={handleChange} required className={inputClass} placeholder="Ex: 1.0.0" />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className={inputClass} placeholder="Description de l'application..." />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-black-800 mb-4 pb-2 border-b border-gray-100">État et criticité</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>État *</label>
              <select name="etat" value={form.etat} onChange={handleChange} required className={inputClass}>
                <option value="">Sélectionner un état</option>
                <option value="En projet">En projet</option>
                <option value="En service">En service</option>
                <option value="Obsolète">Obsolète</option>
                <option value="A décommissionner">À décommissionner</option>
                <option value="Retirée">Retirée</option>
                <option value="Abandonnée">Abandonnée</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Criticité *</label>
              <select name="criticite" value={form.criticite} onChange={handleChange} required className={inputClass}>
                <option value="">Sélectionner une criticité</option>
                <option value="Vitale">Vitale</option>
                <option value="Importante">Importante</option>
                <option value="Secondaire">Secondaire</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-black-800 mb-4 pb-2 border-b border-gray-100">Dates</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Date de création *</label>
              <input type="date" name="dateCreationFiche" value={form.dateCreationFiche} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date de mise en service</label>
              <input type="date" name="dateMiseEnService" value={form.dateMiseEnService} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date d'obsolescence</label>
              <input type="date" name="dateObsolescence" value={form.dateObsolescence} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-black-800 mb-4 pb-2 border-b border-gray-100">Classification</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Catégorie *</label>
              <select name="idCategorie" value={form.categorie.idCategorie} onChange={handleChange} required className={inputClass}>
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.idCategorie} value={cat.idCategorie}>{cat.nomCategorie}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Équipe utilisatrice *</label>
              <select name="idEquipeUtilisatrice" value={form.equipeUtilisatrice.idEquipe} onChange={handleChange} required className={inputClass}>
                <option value="">Sélectionner une équipe</option>
                {equipes.map((eq) => (
                  <option key={eq.idEquipe} value={eq.idEquipe}>{eq.nomEquipe}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Équipe responsable *</label>
              <select name="idEquipeResponsable" value={form.equipeResponsable.idEquipe} onChange={handleChange} required className={inputClass}>
                <option value="">Sélectionner une équipe</option>
                {equipes.map((eq) => (
                  <option key={eq.idEquipe} value={eq.idEquipe}>{eq.nomEquipe}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/applications')} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#FFD100] text-[#0D1B6E] text-sm font-medium hover:bg-[#E6BC00] transition-colors">
            Créer la fiche
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationFormPage;
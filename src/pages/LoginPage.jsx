import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

	try {
		const response = await api.post('/utilisateurs/login', {
			email: form.email,
			motDePasse: form.motDePasse
		});
		
		// Sauvegarde les infos de l'utilisateur
		localStorage.setItem('user', JSON.stringify(response.data));
		
		// Redirige vers le dashboard
		navigate('/dashboard');
		
	} catch (error) {
		setError('Email ou mot de passe incorrect');
	}
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{backgroundColor: '#0D1B6E'}}>
  
  {/* Formes géométriques */}
<div style={{position: 'absolute', top: 0, right: 0, width: '500px', height: '500px', backgroundColor: '#FFD100', borderRadius: '50%', opacity: 0.6, transform: 'translate(50%, -50%)', zIndex: 1}}></div>
<div style={{position: 'absolute', bottom: 0, left: 0, width: '500px', height: '500px', backgroundColor: '#FFD100', borderRadius: '50%', opacity: 0.6, transform: 'translate(-50%, 50%)', zIndex: 1}}></div>
<div style={{position: 'absolute', top: '50%', left: '25%', width: '200px', height: '200px', backgroundColor: '#FFD100', borderRadius: '50%', opacity: 0.5, zIndex: 1}}></div>
<div style={{position: 'absolute', top: '25%', right: '25%', width: '150px', height: '150px', backgroundColor: '#FFD100', opacity: 0.5, transform: 'rotate(45deg)', zIndex: 1}}></div>

  {/* Contenu */}
	<div className="flex justify-center mt-4 w-full mx-auto relative z-10">
	
        {/* Logo */}
        <div className="text-center mb-8">
            <h1 className=" felx justify-center mt-4 text-3xl font-bold text-white flex justify-center mt-4">
            </h1>
        </div>

        {/* Carte */}
	        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
	          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Connexion</h2>
	            <p className="text-gray-500 text-base mb-10 text-center">Connectez-vous à votre espace</p>
	          {error && (
	            <div className="bg-red-50 border border-red-100 text-red-600 text-base px-6 py-4 rounded-2xl mb-8">
	              {error}
	            </div>
	          )}
	          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
	            <div>
	              <label className="block text-base font-medium text-gray-700 mb-2">
	                Adresse email
	              </label>
	              <input
	                type="email"
	                name="email"
	                autoComplete="off"
	                value={form.email}
	                onChange={handleChange}
	                required
	                placeholder="exemple@yas.sn"
	                className="w-full px-6 py-4 bg-[#F8FAFC] border border-gray-200 rounded-2xl text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100] transition-all placeholder:text-gray-400"
	              />
	            </div>
	            <div>
	              <label className="block text-base font-medium text-gray-700 mb-2">
	                Mot de passe
	              </label>
	              <input
	                type="password"
	                name="motDePasse"
	                autoComplete="new-password" 
	                value={form.motDePasse}
	                onChange={handleChange}
	                required
	                placeholder="••••••••"
	                className="w-full px-6 py-4 bg-[#F8FAFC] border border-gray-200 rounded-2xl text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFD100]/20 focus:border-[#FFD100] transition-all placeholder:text-gray-400"
	              />
	            </div>
	            <button
	              type="submit"
	              className="w-full bg-white text-[#0D1B6E] py-4 rounded-2xl text-base font-semibold hover:bg-gray-50 border border-[#0D1B6E] transition-colors mt-2"
	            >
	              Se connecter
	            </button>
	          </form>
        </div> 
      </div>
    </div>
  );
}

export default LoginPage;
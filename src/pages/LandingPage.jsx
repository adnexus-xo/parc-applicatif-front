import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden" style={{backgroundColor: '#0D1B6E'}}>
      
      {/* Formes décoratives */}
      <div style={{position: 'absolute', top: 0, right: 0, width: '500px', height: '500px', backgroundColor: '#FFD100', borderRadius: '50%', opacity: 0.6, transform: 'translate(40%, -40%)', zIndex: 1}}></div>
      <div style={{position: 'absolute', bottom: 0, left: 0, width: '400px', height: '400px', backgroundColor: '#FFD100', borderRadius: '50%', opacity: 0.6, transform: 'translate(-40%, 40%)', zIndex: 1}}></div>
      <div style={{position: 'absolute', top: '40%', left: '10%', width: '150px', height: '150px', backgroundColor: '#FFD100', borderRadius: '50%', opacity: 0.4, zIndex: 1}}></div>
      <div style={{position: 'absolute', bottom: '30%', right: '10%', width: '80px', height: '80px', backgroundColor: '#FFD100', opacity: 0.4, transform: 'rotate(45deg)', zIndex: 1}}></div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 relative" style={{zIndex: 10}}>
        
        {/* Titre */}
        <h1 className="text-9xl font-bold text-white tracking-tight">
          Parc<span className="text-[#FFD100]">App</span>
        </h1>

        {/* Phrase descriptive */}
        <h2 className="text-white/100 text-3xl mt-16 text-center whitespace-nowrap">
          Votre solution de gestion du parc applicatif - suivez, analysez et optimisez vos applications en toute simplicité.
        </h2>

        {/* Bouton */}
        <button
          onClick={() => navigate('/login')}
          className="mt-20 px-16 py-5 bg-[#FFD100] text-[#0D1B6E] text-lg font-bold rounded-2xl hover:bg-[#E6BC00] transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          Accéder à l'application →
        </button>
      </div>

      {/* Footer */}
      <p className="relative text-[#FFD100] text-base pb-6" style={{zIndex: 10}}>
        YAS SENEGAL 2026
      </p>
    </div>
  );
}

export default LandingPage;
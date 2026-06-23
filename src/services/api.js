import axios from 'axios';

const api = axios.create({
  // Regarde bien le "-dfa2" ajouté ici pour correspondre à ton vrai lien Railway
  baseURL: 'https://parc-applicatif-back-production-dfa2.up.railway.app/api',
});

export default api;
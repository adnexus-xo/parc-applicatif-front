import axios from 'axios';

const api = axios.create({
  baseURL: 'https://parc-applicatif-back-production-dfa2.up.railway.app/api',
});

export default api;
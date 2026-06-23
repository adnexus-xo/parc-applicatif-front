import axios from 'axios';

const api = axios.create({
  baseURL: 'https://parc-applicatif-back-production.up.railway.app/api',
});

export default api;




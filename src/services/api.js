import axios from 'axios';

const api = axios.create({
  baseURL: 'https://parc-applicatif-back-production-dfa2.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
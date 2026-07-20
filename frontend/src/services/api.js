import axios from "axios";

/*
  Instance Axios utilisée pour communiquer
  avec le backend Anonyma.
*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/*
  Avant chaque requête, on ajoute automatiquement
  le JWT si l'utilisateur est connecté.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("anonyma_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
  Si le serveur renvoie 401 (token expiré ou invalide),
  on supprime le token enregistré.
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("anonyma_token");
    }

    return Promise.reject(error);
  }
);

export default api;
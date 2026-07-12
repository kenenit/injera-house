import axios from 'axios'

// In local development, call the API through Vite's dev-server proxy
// (see vite.config.js: '/api' -> http://localhost:4000) so the app talks
// to whatever backend you're running locally — including new routes like
// /admin/menu that only exist in this codebase until you deploy them.
//
// In production builds, call the deployed backend directly. Override with
// VITE_API_URL in a .env file if you deploy the API somewhere else.
const baseURL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL || 'https://injera-house-server.onrender.com/api'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
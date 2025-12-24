import axios from 'axios'
import { Cookies } from 'quasar'

export function useApi(baseURL) {
  // Vite expõe as variáveis de ambiente via import.meta.env
  // process.env.BASE_URL é injetado pelo Quasar via build.env
  const defaultBaseURL = import.meta.env.VITE_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'
  const apiBaseURL = baseURL || `${defaultBaseURL}/api`

  console.log('baseURL', baseURL)
  console.log('import.meta.env.VITE_BASE_URL', import.meta.env.VITE_BASE_URL)
  console.log('process.env.BASE_URL', process.env.BASE_URL)
  console.log('apiBaseURL final', apiBaseURL)

  const apiClient = axios.create({
    baseURL: apiBaseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  })

  // Configurar interceptors
  apiClient.interceptors.request.use(
    async (config) => {
      const token = Cookies.get('auth_token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // Se receber 401, remove o token e redireciona para login
      if (error.response?.status === 401) {
        Cookies.remove('auth_token', { path: '/' })
        Cookies.remove('workspace_id', { path: '/' })
        window.location.href = '/login'
      }

      console.error(
        'Erro na requisição:',
        error.response?.data || error.message
      )
      return Promise.reject(error)
    }
  )

  return apiClient
}

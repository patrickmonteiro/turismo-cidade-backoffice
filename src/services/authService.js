import { useApi } from 'src/composables/useApi'

const api = useApi()

export const authService = {
  async register(payload) {
    try {
      const { data } = await api.post('/auth/register', payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async login(payload) {
    try {
      const { data } = await api.post('/auth/login', payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  formatError(error) {
    return error.response?.data?.error || error.response?.data?.message || 'Erro inesperado'
  }
}

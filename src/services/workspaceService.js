import { useApi } from 'src/composables/useApi'

const api = useApi()

export const workspaceService = {
  async getAll() {
    try {
      const { data } = await api.get('/workspaces')
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/workspaces/${id}`)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post('/workspaces', payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async update(id, payload) {
    try {
      const { data } = await api.put(`/workspaces/${id}`, payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  formatError(error) {
    return error.response?.data?.error || error.response?.data?.message || 'Erro inesperado'
  }
}

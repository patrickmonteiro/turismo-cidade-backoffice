import { useApi } from 'src/composables/useApi'

const api = useApi()

export const eventService = {
  async create(payload) {
    try {
      const { data } = await api.post('/events', payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async getByWorkspace(workspaceId, params = {}) {
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/events`, { params })
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  formatError(error) {
    return error.response?.data?.error || error.response?.data?.message || 'Erro inesperado'
  }
}

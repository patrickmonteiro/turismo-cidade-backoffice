import { useApi } from 'src/composables/useApi'

const api = useApi()

export const placeService = {
  async create(payload) {
    try {
      const { data } = await api.post('/places', payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async getByWorkspace(workspaceId) {
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/places`)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  formatError(error) {
    return error.response?.data?.error || error.response?.data?.message || 'Erro inesperado'
  }
}

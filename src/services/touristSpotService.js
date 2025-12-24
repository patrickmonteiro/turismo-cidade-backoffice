import { useApi } from 'src/composables/useApi'

const api = useApi()

export const touristSpotService = {
  async create(payload) {
    try {
      const { data } = await api.post('/tourist-spots', payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async getByWorkspace(workspaceId) {
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/tourist-spots`)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  formatError(error) {
    return error.response?.data?.error || error.response?.data?.message || 'Erro inesperado'
  }
}

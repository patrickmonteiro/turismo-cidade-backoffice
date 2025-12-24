import { useApi } from 'src/composables/useApi'

const api = useApi()

export const billingService = {
  async upsert(payload) {
    try {
      const { data } = await api.put('/billing', payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async getByWorkspace(workspaceId) {
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/billing`)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  formatError(error) {
    return error.response?.data?.error || error.response?.data?.message || 'Erro inesperado'
  }
}

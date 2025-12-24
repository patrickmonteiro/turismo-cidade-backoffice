import { useApi } from 'src/composables/useApi'

const api = useApi()

export const villageService = {
  async getAll() {
    try {
      const { data } = await api.get('/aldeia')
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/aldeia/${id}`)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post('/aldeia', payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async update(id, payload) {
    try {
      const { data } = await api.put(`/aldeia/${id}`, payload)
      return data
    } catch (error) {
      throw this.formatError(error)
    }
  },

  async remove(id) {
    try {
      await api.delete(`/aldeia/${id}`)
    } catch (error) {
      throw this.formatError(error)
    }
  },

  formatError(error) {
    return error.response?.data?.message || 'Erro inesperado'
  }
}

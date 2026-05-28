import apiClient from './client'

export default {
  getAll() {
    return apiClient.get('/api/clients')
  },

  getById(id) {
    return apiClient.get(`/api/clients/${id}`)
  },

  create(data) {
    return apiClient.post('/api/clients', data)
  },

  update(id, data) {
    return apiClient.put(`/api/clients/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/api/clients/${id}`)
  }
}

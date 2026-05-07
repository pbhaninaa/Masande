import apiClient from './client'

export default {
  getAll() {
    return apiClient.get('/api/tenants')
  },

  getById(id) {
    return apiClient.get(`/api/tenants/${id}`)
  },

  create(data) {
    return apiClient.post('/api/tenants', data)
  },

  update(id, data) {
    return apiClient.put(`/api/tenants/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/api/tenants/${id}`)
  }
}

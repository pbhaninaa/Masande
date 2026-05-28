import apiClient from './client'

export default {
  getAll() {
    return apiClient.get('/api/routes')
  },

  getActive() {
    return apiClient.get('/api/routes/active')
  },

  getById(id) {
    return apiClient.get(`/api/routes/${id}`)
  },

  create(data) {
    return apiClient.post('/api/routes', data)
  },

  update(id, data) {
    return apiClient.put(`/api/routes/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/api/routes/${id}`)
  },

  toggleStatus(id) {
    return apiClient.patch(`/api/routes/${id}/toggle-status`)
  }
}

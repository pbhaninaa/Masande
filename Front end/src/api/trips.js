import apiClient from './client'

export default {
  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/trips?page=${page}&size=${size}`)
  },

  getById(id) {
    return apiClient.get(`/api/trips/${id}`)
  },

  getByStatus(status) {
    return apiClient.get(`/api/trips/status/${status}`)
  },

  create(data) {
    return apiClient.post('/api/trips', data)
  },

  approve(id, notes) {
    return apiClient.put(`/api/trips/${id}/approve`, { notes })
  },

  reject(id, notes) {
    return apiClient.put(`/api/trips/${id}/reject`, { notes })
  },

  assignUser(tripId, userId) {
    return apiClient.post(`/api/trips/${tripId}/assign/${userId}`)
  }
}

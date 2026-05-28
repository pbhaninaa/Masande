import apiClient from './client'

export default {
  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/users?page=${page}&size=${size}`)
  },

  getById(id) {
    return apiClient.get(`/api/users/${id}`)
  },

  getCurrentUser() {
    return apiClient.get('/api/users/me')
  },

  create(data) {
    return apiClient.post('/api/users', data)
  },

  update(id, data) {
    return apiClient.put(`/api/users/${id}`, data)
  },

  updateProfile(data) {
    return apiClient.put('/api/users/me', data)
  },

  changePassword(oldPassword, newPassword) {
    return apiClient.post('/api/users/change-password', { 
      oldPassword, 
      newPassword 
    })
  },

  delete(id) {
    return apiClient.delete(`/api/users/${id}`)
  },

  deactivate(id) {
    return apiClient.patch(`/api/users/${id}/deactivate`)
  },

  activate(id) {
    return apiClient.patch(`/api/users/${id}/activate`)
  },

  resetPassword(userId) {
    return apiClient.post(`/api/users/${userId}/reset-password`)
  }
}

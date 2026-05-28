import apiClient from './client'

export default {
  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/notifications?page=${page}&size=${size}`)
  },

  getUnread(page = 0, size = 10) {
    return apiClient.get(`/api/notifications/unread?page=${page}&size=${size}`)
  },

  markAsRead(id) {
    return apiClient.put(`/api/notifications/${id}/read`)
  },

  markAllAsRead() {
    return apiClient.put('/api/notifications/read-all')
  },

  delete(id) {
    return apiClient.delete(`/api/notifications/${id}`)
  },

  getById(id) {
    return apiClient.get(`/api/notifications/${id}`)
  },

  sendNotification(data) {
    return apiClient.post('/api/notifications/send', data)
  }
}

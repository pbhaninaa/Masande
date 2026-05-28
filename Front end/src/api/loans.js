import apiClient from './client'

export default {
  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/loans?page=${page}&size=${size}`)
  },

  getById(id) {
    return apiClient.get(`/api/loans/${id}`)
  },

  getByStatus(status) {
    return apiClient.get(`/api/loans/status/${status}`)
  },

  getClientLoans(clientId) {
    return apiClient.get(`/api/loans/client/${clientId}`)
  },

  create(data) {
    return apiClient.post('/api/loans', data)
  },

  update(id, data) {
    return apiClient.put(`/api/loans/${id}`, data)
  },

  approveLoan(id, notes) {
    return apiClient.put(`/api/loans/${id}/approve`, { notes })
  },

  rejectLoan(id, notes) {
    return apiClient.put(`/api/loans/${id}/reject`, { notes })
  },

  disburseLoan(id) {
    return apiClient.post(`/api/loans/${id}/disburse`)
  }
}

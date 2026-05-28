import apiClient from './client'

export default {
  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/statements?page=${page}&size=${size}`)
  },

  getById(id) {
    return apiClient.get(`/api/statements/${id}`)
  },

  getClientStatements(clientId) {
    return apiClient.get(`/api/statements/client/${clientId}`)
  },

  getByPeriod(startDate, endDate) {
    return apiClient.get('/api/statements/period', {
      params: { startDate, endDate }
    })
  },

  generateMonthlyStatement(clientId, month, year) {
    return apiClient.post('/api/statements/generate', {
      clientId,
      month,
      year
    })
  },

  sendStatement(id) {
    return apiClient.post(`/api/statements/${id}/send`)
  },

  downloadPdf(id) {
    return apiClient.get(`/api/statements/${id}/pdf`, {
      responseType: 'blob'
    })
  },

  downloadCsv(id) {
    return apiClient.get(`/api/statements/${id}/csv`, {
      responseType: 'blob'
    })
  }
}

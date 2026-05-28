import apiClient from './client'

export default {
  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/invoices?page=${page}&size=${size}`)
  },

  getById(id) {
    return apiClient.get(`/api/invoices/${id}`)
  },

  getClientInvoices(clientId) {
    return apiClient.get(`/api/invoices/client/${clientId}`)
  },

  getByStatus(status) {
    return apiClient.get(`/api/invoices/status/${status}`)
  },

  create(data) {
    return apiClient.post('/api/invoices', data)
  },

  update(id, data) {
    return apiClient.put(`/api/invoices/${id}`, data)
  },

  sendInvoice(id) {
    return apiClient.post(`/api/invoices/${id}/send`)
  },

  markAsPaid(id) {
    return apiClient.patch(`/api/invoices/${id}/mark-paid`)
  },

  cancelInvoice(id) {
    return apiClient.post(`/api/invoices/${id}/cancel`)
  },

  generatePdf(id) {
    return apiClient.get(`/api/invoices/${id}/pdf`, {
      responseType: 'blob'
    })
  }
}

import apiClient from './client'

export default {
  recordPayment(invoiceId, clientId, amount, method, referenceNumber) {
    return apiClient.post('/api/payments', 
      { amount, method, referenceNumber },
      { params: { invoiceId, clientId } }
    )
  },

  getClientPayments(clientId) {
    return apiClient.get(`/api/payments/client/${clientId}`)
  },

  getInvoicePayments(invoiceId) {
    return apiClient.get(`/api/payments/invoice/${invoiceId}`)
  },

  confirmPayment(paymentId) {
    return apiClient.post(`/api/payments/${paymentId}/confirm`)
  },

  cancelPayment(paymentId) {
    return apiClient.post(`/api/payments/${paymentId}/cancel`)
  },

  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/payments?page=${page}&size=${size}`)
  },

  getById(id) {
    return apiClient.get(`/api/payments/${id}`)
  }
}

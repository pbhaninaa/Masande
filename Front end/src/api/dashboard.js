import apiClient from './client'

export default {
  getPlatformDashboard() {
    return apiClient.get('/api/dashboard/platform-admin')
  },

  getTenantDashboard() {
    return apiClient.get('/api/dashboard/tenant')
  },

  getCustomerDashboard(customerId) {
    return apiClient.get(`/api/dashboard/customer/${customerId}`)
  }
}

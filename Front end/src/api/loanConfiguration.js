import apiClient from './client'

export default {
  getConfiguration() {
    return apiClient.get('/api/loan-configuration')
  },

  saveOrUpdate(data) {
    return apiClient.post('/api/loan-configuration', data)
  },

  areLoansEnabled() {
    return apiClient.get('/api/loan-configuration/enabled')
  }
}

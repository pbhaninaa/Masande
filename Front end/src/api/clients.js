import apiClient from './client'

export default {
  getAll() {
    return apiClient.get('/clients')
  },

  create(data) {
    return apiClient.post('/clients', data)
  }
}

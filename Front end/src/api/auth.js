import apiClient from './client'

export default {
  login(credentials) {
    return apiClient.post('/api/auth/login', credentials)
  },

  register(userData) {
    return apiClient.post('/api/auth/register', userData)
  }
}

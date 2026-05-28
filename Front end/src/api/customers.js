import apiClient from './client'

export default {
  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/customers?page=${page}&size=${size}`)
  },

  getById(id) {
    return apiClient.get(`/api/customers/${id}`)
  },

  create(data) {
    return apiClient.post('/api/customers', data)
  },

  update(id, data) {
    return apiClient.put(`/api/customers/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/api/customers/${id}`)
  },

  getByTenant(tenantId) {
    return apiClient.get(`/api/customers/tenant/${tenantId}`)
  },

  deactivate(id) {
    return apiClient.patch(`/api/customers/${id}/deactivate`)
  },

  activate(id) {
    return apiClient.patch(`/api/customers/${id}/activate`)
  }
}

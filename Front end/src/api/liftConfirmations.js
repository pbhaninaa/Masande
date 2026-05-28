import apiClient from './client'

export default {
  confirmMorningLift(clientId, routeId) {
    return apiClient.post('/api/lift-confirmations/morning/confirm', null, {
      params: { clientId, routeId }
    })
  },

  confirmAfternoonLift(clientId, routeId) {
    return apiClient.post('/api/lift-confirmations/afternoon/confirm', null, {
      params: { clientId, routeId }
    })
  },

  cancelMorningLift(clientId, routeId, reason = '') {
    return apiClient.post('/api/lift-confirmations/morning/cancel', null, {
      params: { clientId, routeId, reason }
    })
  },

  cancelAfternoonLift(clientId, routeId, reason = '') {
    return apiClient.post('/api/lift-confirmations/afternoon/cancel', null, {
      params: { clientId, routeId, reason }
    })
  },

  getByDate(date) {
    return apiClient.get('/api/lift-confirmations/date', {
      params: { date }
    })
  },

  completeLift(id) {
    return apiClient.patch(`/api/lift-confirmations/${id}/complete`)
  },

  markNoShow(id) {
    return apiClient.patch(`/api/lift-confirmations/${id}/no-show`)
  },

  getAll(page = 0, size = 10) {
    return apiClient.get(`/api/lift-confirmations?page=${page}&size=${size}`)
  },

  getById(id) {
    return apiClient.get(`/api/lift-confirmations/${id}`)
  }
}

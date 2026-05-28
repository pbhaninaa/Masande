import tripsApi from '../../api/trips'

export default {
  namespaced: true,

  state: {
    trips: [],
    currentTrip: null,
    pagination: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    },
    loading: false
  },

  mutations: {
    SET_TRIPS(state, trips) {
      state.trips = trips
    },

    SET_CURRENT_TRIP(state, trip) {
      state.currentTrip = trip
    },

    SET_PAGINATION(state, pagination) {
      state.pagination = pagination
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },

  actions: {
    async fetchTrips({ commit }, { page = 0, size = 10 } = {}) {
      try {
        commit('SET_LOADING', true)
        const response = await tripsApi.getAll(page, size)
        const { content, totalElements, totalPages, number, size: pageSize } = response.data.data
        commit('SET_TRIPS', content)
        commit('SET_PAGINATION', {
          page: number,
          size: pageSize,
          totalElements,
          totalPages
        })
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchTripById({ commit }, id) {
      try {
        const response = await tripsApi.getById(id)
        commit('SET_CURRENT_TRIP', response.data.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async createTrip({ dispatch }, tripData) {
      try {
        const response = await tripsApi.create(tripData)
        await dispatch('fetchTrips', { page: 0 })
        return response.data
      } catch (error) {
        throw error
      }
    },

    async approveTrip({ dispatch }, { id, notes } = {}) {
      try {
        const response = await tripsApi.approve(id, notes)
        await dispatch('fetchTrips', { page: 0 })
        return response.data
      } catch (error) {
        throw error
      }
    },

    async rejectTrip({ dispatch }, { id, notes } = {}) {
      try {
        const response = await tripsApi.reject(id, notes)
        await dispatch('fetchTrips', { page: 0 })
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
}

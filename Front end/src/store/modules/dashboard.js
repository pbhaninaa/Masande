import dashboardApi from '../../api/dashboard'

export default {
  namespaced: true,

  state: {
    platformStats: null,
    tenantStats: null,
    customerStats: null,
    loading: false
  },

  mutations: {
    SET_PLATFORM_STATS(state, stats) {
      state.platformStats = stats
    },

    SET_TENANT_STATS(state, stats) {
      state.tenantStats = stats
    },

    SET_CUSTOMER_STATS(state, stats) {
      state.customerStats = stats
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },

  actions: {
    async fetchPlatformDashboard({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await dashboardApi.getPlatformDashboard()
        commit('SET_PLATFORM_STATS', response.data.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchTenantDashboard({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await dashboardApi.getTenantDashboard()
        commit('SET_TENANT_STATS', response.data.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchCustomerDashboard({ commit }, customerId) {
      try {
        commit('SET_LOADING', true)
        const response = await dashboardApi.getCustomerDashboard(customerId)
        commit('SET_CUSTOMER_STATS', response.data.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}

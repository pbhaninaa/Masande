import tenantsApi from '../../api/tenants'

export default {
  namespaced: true,

  state: {
    tenants: [],
    currentTenant: null,
    loading: false
  },

  mutations: {
    SET_TENANTS(state, tenants) {
      state.tenants = tenants
    },

    SET_CURRENT_TENANT(state, tenant) {
      state.currentTenant = tenant
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },

  actions: {
    async fetchTenants({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await tenantsApi.getAll()
        commit('SET_TENANTS', response.data.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchTenantById({ commit }, id) {
      try {
        const response = await tenantsApi.getById(id)
        commit('SET_CURRENT_TENANT', response.data.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async createTenant({ dispatch }, tenantData) {
      try {
        const response = await tenantsApi.create(tenantData)
        await dispatch('fetchTenants')
        return response.data
      } catch (error) {
        throw error
      }
    },

    async updateTenant({ dispatch }, { id, data }) {
      try {
        const response = await tenantsApi.update(id, data)
        await dispatch('fetchTenants')
        return response.data
      } catch (error) {
        throw error
      }
    },

    async deleteTenant({ dispatch }, id) {
      try {
        const response = await tenantsApi.delete(id)
        await dispatch('fetchTenants')
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
}

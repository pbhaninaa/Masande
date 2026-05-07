import clientsApi from '../../api/clients'

export default {
  namespaced: true,

  state: {
    clients: [],
    loading: false
  },

  mutations: {
    SET_CLIENTS(state, clients) {
      state.clients = clients
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },

  actions: {
    async fetchClients({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await clientsApi.getAll()
        commit('SET_CLIENTS', response.data.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createClient({ dispatch }, clientData) {
      try {
        const response = await clientsApi.create(clientData)
        await dispatch('fetchClients')
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
}

import clientsApi from '../../api/clients'
import messagingApi from '../../api/messaging'

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
        
        // Send welcome WhatsApp message to client
        try {
          await messagingApi.sendClientWelcomeMessage(
            clientData.phoneNumber,
            clientData.name
          )
          console.log('Welcome message sent to', clientData.phoneNumber)
        } catch (notificationError) {
          console.warn('Failed to send welcome message:', notificationError)
          // Don't fail the client creation if notification fails
        }
        
        await dispatch('fetchClients')
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
}

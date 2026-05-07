import authApi from '../../api/auth'

export default {
  namespaced: true,

  state: {
    token: localStorage.getItem('auth_token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  },

  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user,
    userRoles: state => state.user?.roles || [],
    tenantId: state => state.user?.tenantId || null,
    isPlatformAdmin: state => {
      const roles = state.user?.roles || []
      return roles.includes('PLATFORM_ADMIN')
    },
    isTenantAdmin: state => {
      const roles = state.user?.roles || []
      return roles.includes('TENANT_ADMIN') || roles.includes('TENANT_MANAGER')
    }
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    },

    SET_USER(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    }
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authApi.login(credentials)
        const data = response.data.data

        // Backend returns: { token, userId, username, email, fullName, tenantId, roles }
        commit('SET_TOKEN', data.token)
        commit('SET_USER', {
          userId: data.userId,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          tenantId: data.tenantId,
          roles: data.roles
        })

        return response.data
      } catch (error) {
        throw error
      }
    },

    async register({ commit }, userData) {
      try {
        const response = await authApi.register(userData)
        const data = response.data.data

        commit('SET_TOKEN', data.token)
        commit('SET_USER', {
          userId: data.userId,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          tenantId: data.tenantId,
          roles: data.roles
        })

        return response.data
      } catch (error) {
        throw error
      }
    },

    logout({ commit }) {
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
    }
  }
}

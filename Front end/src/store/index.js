import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import trips from './modules/trips'
import clients from './modules/clients'
import tenants from './modules/tenants'
import dashboard from './modules/dashboard'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    trips,
    clients,
    tenants,
    dashboard
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import system from '@/store/modules/system'
import user from '@/store/modules/user'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters,
  mutations: {
  },
  actions: {
  },
  modules: {
    system,
    user
  }
})

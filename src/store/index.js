import { createStore } from 'vuex'
import system from '@/store/modules/system'
import user from '@/store/modules/user'
import getters from './getters'

export default createStore({
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

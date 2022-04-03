import { getOptions } from '@/api/service'

const user = {
  state: {
    options: '',
    serviceMsg: '',
    serviceMsgClass: ''
  },

  mutations: {
    SET_OPTIONS: (state, options) => { state.options = options },
    SET_SERVICE_MSG: (state, serviceMsg) => { state.serviceMsg = serviceMsg },
    SET_SERVICE_MSG_CLASS: (state, serviceMsgClass) => { state.serviceMsgClass = serviceMsgClass },
  },

  actions: {
    async GetOptionsService ({ commit }) {
      return new Promise((resolve, reject) => {
        getOptions()
          .then(resp => {
            const data = resp.data

            if(data.status) {
              commit('SET_OPTIONS', data.data)
            }

            resolve()
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
      })
    },

    ServiceNotify ({ commit }, data) {
      commit('SET_SERVICE_MSG', data.message)
      commit('SET_SERVICE_MSG_CLASS', data.class)
    }
  }
}

export default user

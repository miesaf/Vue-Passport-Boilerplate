// Small replacement for idle-vue: keeps `store.state.idleVue.isIdle` up to date.
// The user is idle after `idleTime` ms without any of the watched events.
export default {
  install (app, { store, idleTime = 60000, startAtIdle = false, moduleName = 'idleVue', events = ['mousemove', 'keydown', 'mousedown', 'touchstart'] } = {}) {
    store.registerModule(moduleName, {
      namespaced: true,
      state: () => ({ isIdle: startAtIdle }),
      mutations: {
        IDLE_CHANGED (state, isIdle) { state.isIdle = isIdle }
      }
    })

    let timer = null
    const setIdle = (isIdle) => {
      if (store.state[moduleName].isIdle !== isIdle) store.commit(`${moduleName}/IDLE_CHANGED`, isIdle)
    }
    const activity = () => {
      setIdle(false)
      clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), idleTime)
    }

    events.forEach(event => window.addEventListener(event, activity, { passive: true }))
    if (!startAtIdle) activity()
  }
}

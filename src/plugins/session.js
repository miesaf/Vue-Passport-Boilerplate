// Small replacement for vue-session: `this.$session.flash.get/set/remove`.
// Flash values live in sessionStorage and are removed when read.
const STORAGE_KEY = 'vue-session-key'
const FLASH_KEY = '__vue_session_flash'

function readAll () {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function writeAll (all) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // storage unavailable (private mode, blocked): flash messages are simply dropped
  }
}

export const session = {
  flash: {
    get (key) {
      const value = (readAll()[FLASH_KEY] || {})[key]
      this.remove(key)
      return value
    },
    set (key, value) {
      const all = readAll()
      all[FLASH_KEY] = { ...(all[FLASH_KEY] || {}), [key]: value }
      writeAll(all)
    },
    remove (key) {
      const all = readAll()
      if (all[FLASH_KEY] && key in all[FLASH_KEY]) {
        delete all[FLASH_KEY][key]
        writeAll(all)
      }
    }
  }
}

export default {
  install (app) {
    app.config.globalProperties.$session = session
  }
}

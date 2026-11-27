import { useToast } from 'bootstrap-vue-next'

// Keeps the BootstrapVue 2 call shape used by the views:
// this.$bvToast.toast(message, { title, autoHideDelay, variant, solid })
// Needs createBootstrap() installed first and a <b-orchestrator /> (or <b-app>) mounted.
export default {
  install (app) {
    const toaster = app.runWithContext(() => useToast())

    app.config.globalProperties.$bvToast = {
      toast (message, options = {}) {
        if (!message) return
        toaster.create({
          body: String(message),
          title: options.title || undefined,
          variant: options.variant || undefined,
          solid: options.solid ?? false,
          modelValue: options.autoHideDelay ?? 5000,
          noProgress: true
        })
      }
    }
  }
}

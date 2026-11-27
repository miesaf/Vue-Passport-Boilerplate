import { createApp } from 'vue'
import {
  createBootstrap, vBTooltip,
  BAlert, BBadge, BButton, BCard, BCardBody, BCardText, BCol, BCollapse, BContainer, BDropdownDivider,
  BDropdownItem, BForm, BFormCheckbox, BFormGroup, BFormInput, BFormInvalidFeedback, BFormSelect, BFormTextarea,
  BImg, BModal, BNavItemDropdown, BNavbar, BNavbarBrand, BNavbarNav, BNavbarToggle, BOffcanvas, BOrchestrator,
  BOverlay, BRow, BSpinner, BTable
} from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'
import store from './store'
import IdlePlugin from './plugins/idle'
import SessionPlugin from './plugins/session'
import ToastPlugin from './plugins/toast'
import BIcon from './components/BIcon.vue'

// Bootstrap 5, BootstrapVueNext and Bootstrap Icons CSS (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

// Make BootstrapVueNext available throughout the project
app.use(createBootstrap())
Object.entries({
  BAlert, BBadge, BButton, BCard, BCardBody, BCardText, BCol, BCollapse, BContainer, BDropdownDivider,
  BDropdownItem, BForm, BFormCheckbox, BFormGroup, BFormInput, BFormInvalidFeedback, BFormSelect, BFormTextarea,
  BImg, BModal, BNavItemDropdown, BNavbar, BNavbarBrand, BNavbarNav, BNavbarToggle, BOffcanvas, BOrchestrator,
  BOverlay, BRow, BSpinner, BTable
}).forEach(([name, component]) => app.component(name, component))
app.component('BIcon', BIcon)
app.directive('b-tooltip', vBTooltip)

// Session idle time out (SITO)
app.use(IdlePlugin, {
  store,
  idleTime: (Number(import.meta.env.VUE_APP_SITO) || 900) * 1000,  // convert seconds to miliseconds
  startAtIdle: false
})
app.use(SessionPlugin)
app.use(ToastPlugin)

app.use(store)
app.use(router)

app.mount('#app')

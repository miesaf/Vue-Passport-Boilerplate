<template>
  <div id="app" @mousemove="user_input()" @keydown="user_input()" @click="user_input()">
    <b-modal id="sito-modal" title="Warning" v-model="sito_disp" hide-header-close no-close-on-backdrop no-close-on-esc>
      <b-row>
        <b-col cols="2">
          <b-icon icon="exclamation-triangle-fill" variant="warning" class="mr-3" font-scale="3"></b-icon>
        </b-col>
        <b-col cols="10">
          <span>You have been inactive for a moment. Auto logging out in {{ sito_dispSecLeft }} seconds.</span>
        </b-col>
      </b-row>

      <template #modal-footer>
        <div class="float-right">
          <b-button variant="danger" @click="sito_logout_call()" >Logout</b-button>
          <b-button variant="info" class="ml-2" @click="sito_close_disp()" >Continue Session</b-button>
        </div>
      </template>
    </b-modal>
    <router-view/>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "AppRoot",

  data() {
    return {
      toast: {
        class: null,
        title: null,
        message: null,
        life: 5000
      },
      sito_defaultSecLeft: 60, // In seconds
      sito_secLeft: 0,
      sito_disp: false,
      sito_dispSecLeft: 0,
      sito_last_activity: moment(new Date()),
      sito_logout: false
    }
  },

  beforeCreate() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.info("%cWARNING" ,"font: 42px Arial; font-weight: bold; color: #F00; padding: 4px 12px")
      console.info("%cThis is a browser feature intended for system developers. DO NOT paste any script or codes here." ,"font: 18px Arial; color: #FFF; padding: 4px 12px")
      console.info("%cDeveloped by MieSaF" ,"font: 12px Arial; font-weight: bold; color: #FFF; padding: 4px 12px")
    } else {
      console.info("%cWARNING" ,"font: 42px Arial; font-weight: bold; color: #F00; padding: 4px 12px")
      console.info("%cThis is a browser feature intended for system developers. DO NOT paste any script or codes here." ,"font: 18px Arial; color: #000; padding: 4px 12px")
      console.info("%cDeveloped by MieSaF" ,"font: 12px Arial; font-weight: bold; color: #000; padding: 4px 12px")
    }
  },

  watch: {
    serviceMsgPipe: function (val) {
      if(val) {
        this.$bvToast.toast(val, { autoHideDelay: 10000, variant: this.serviceMsgClassPipe, solid: true })
      }

      this.$store.dispatch("ServiceNotify", { message: null, class: null })
    },

    isIdlePipe: function (val) {
      process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] [SITO] Is idle: ' + val)

      if(!this.sito_disp && val && this.$store.getters.token) {
        this.sito_secLeft = this.sito_defaultSecLeft
        this.sito_dispSecLeft = this.sito_defaultSecLeft
        this.sito_disp = true
        this.sito_last_activity = moment(new Date())
      }
    },

    sito_secLeft: {
      handler() {
        if (this.sito_disp) {
          setTimeout(() => {
            this.sito_secLeft--
            process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] [SITO] Seconds left: ' + this.sito_secLeft)

            if(this.sito_secLeft >= 0) {
              this.sito_dispSecLeft = this.sito_secLeft
              process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] [SITO] Second left (Display): ' + this.sito_dispSecLeft)
            } else {
              process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] [SITO] Seconds left (Timed out): ' + this.sito_secLeft)
              this.sito_logout = true
            }
          }, 1000)
        }
      },
      immediate: true // This ensures the watcher is triggered upon creation
    },

    sito_logout: function (val) {
      if(val && this.$store.getters.token) {
        // Logout
        this.sito_logout_call()
      }
    }
  },

  computed: {
    serviceMsgPipe() {
      return this.$store.state.system.serviceMsg
    },
    serviceMsgClassPipe() {
      return this.$store.state.system.serviceMsgClass
    },
    tokenPipe() {
      return this.$store.getters.token
    },
    isIdlePipe() {
      return this.$store.state.idleVue.isIdle
    }
  },

  methods: {
    // Closing modal and reseting SITO notification countdown
    sito_close_disp() {
      this.sito_disp = false
      this.sito_secLeft = this.sito_defaultSecLeft
      this.sito_dispSecLeft = this.sito_defaultSecLeft
    },

    sito_logout_call() {
      // Logout
      console.info("Logged out due to user inactivity")
      this.sito_disp = false
      this.sito_logout = false
      if(this.$store.getters.token) { window.location.replace("#/logout") }
    },

    user_input() {
      if((this.sito_secLeft < 0) && this.sito_logout) {
        process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] [SITO] Delayed logout executed')
        this.sito_logout_call()
      } else {
        const last_activity = this.sito_last_activity
        const countdown_ceiling = moment(last_activity).add(this.sito_defaultSecLeft, 'seconds')
        if(moment(new Date()).isAfter(countdown_ceiling) && this.sito_logout) {
          this.sito_last_activity = new Date()
          if(this.$route.name != 'login') { this.sito_logout_call() }
        }
      }
    },

    makeToast() {
      this.$bvToast.toast(this.toast.message, {
        title: this.toast.message,
        autoHideDelay: this.toast.life,
        variant: this.toast.class,
        solid: true
      })
    }
  }
}
</script>

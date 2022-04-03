<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12" md="8" class="py-3">
        <h3 class="pb-2">Dashboard</h3>
        
        <b-alert
          :show="alert.dismissCountDown"
          dismissible
          fade
          :variant="alert.class"
          @dismissed="alert.dismissCountDown=0"
        >
          <p>{{ alert.message }}</p>
        </b-alert>

        <b-card>
          <b-card-text>Welcome to Vue + Laravel Passport Boilerplate, <b>{{ $store.state.user.authName }}</b>!</b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "SysDashboard",

  data() {
    return {
      alert: {
        message: '',
        class: '',
        dismissCountDown: 0
      }
    }
  },

  created() {
    var flashMessage = this.$session.flash.get("flash-message")
    if(flashMessage) {
      this.alert.message = flashMessage
      this.alert.class = this.$session.flash.get("flash-class")
      this.alert.dismissCountDown = 10
    }
  },
}
</script>

<style>

</style>
<template>
  <div class="login-body">
  </div>
</template>

<script>
import { logout } from "@/api/auth.js"

export default {
  name: "LogoutPage",

  data() {
    return {
      flash: {
        message: '',
        class: ''
      }
    }
  },
  async created() {
    try {
      await logout().then((res) => {
        if (res.data.status) {
          this.$store
            .dispatch("Logout")
            .then(() => {
              this.flash.class = "success"
              this.flash.message = res.data.message
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })
            })
            .then(() => {
              new Promise(r => setTimeout(r, 2000))
            })
            .catch(() => {
              this.flash.class = "warning"
              this.flash.message = "Token revocation failed"
              this.$bvToast.toast("Token revocation failed", { autoHideDelay: 10000, variant: "warning", solid: true })
            })
        } else {
          this.flash.class = "danger"
          this.flash.message = res.data.message
        }
      });
    } catch (e) {
      console.error(e)
      await this.$store
        .dispatch("Logout")
        .then(() => {
          this.flash.class = "warning"
          this.flash.message = "Logout partially successful"
          this.$bvToast.toast("Logout partially successfull", { autoHideDelay: 5000, variant: "warning", solid: true })
        })
        .then(() => {
          new Promise(r => setTimeout(r, 2000))
        })
        .catch(() => {
          this.flash.class = "danger"
          this.flash.message = "Logout failed"
          this.$bvToast.toast("Logout failed", { autoHideDelay: 10000, variant: "danger", solid: true })
        });
    }

    await this.$router.push({ name: 'login' })
  }
}
</script>

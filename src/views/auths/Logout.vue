<template>
  <div class="login-body">
  </div>
</template>

<script>
import { logout } from "@/api/auth.js"

export default {
  name: "LogoutPage",

  async created() {
    if(this.$session.flash.get("flash-message")) {
      this.$bvToast.toast(this.$session.flash.get("flash-message"), { autoHideDelay: 5000, variant: this.$session.flash.get("flash-class"), solid: true })
    }

    try {
      await logout().then((res) => {
        if (res.data.status) {
          this.$store
            .dispatch("Logout")
            .then(() => {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })
            })
            .then(() => {
              new Promise(r => setTimeout(r, 2000))
            })
            .catch(() => {
              this.$bvToast.toast("Token revocation failed", { autoHideDelay: 10000, variant: "warning", solid: true })
            })
        } else {
          this.$bvToast.toast(res.data.message, { autoHideDelay: 10000, variant: "danger", solid: true })
        }
      });
    } catch (e) {
      console.error(e)
      await this.$store
        .dispatch("Logout")
        .then(() => {
          this.$bvToast.toast("Logout partially successfull", { autoHideDelay: 5000, variant: "warning", solid: true })
        })
        .then(() => {
          new Promise(r => setTimeout(r, 2000))
        })
        .catch(() => {
          this.$bvToast.toast("Logout failed", { autoHideDelay: 10000, variant: "danger", solid: true })
        });
    }

    await this.$router.push({ name: 'login' })
  }
}
</script>

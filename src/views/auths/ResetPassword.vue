<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12" md="5" class="py-3">
        <h3 class="pb-2">Password Reset</h3>

        <b-form>
          <b-form-group label="New Password:">
            <b-form-input v-model="input.password.value" type="password" placeholder="Enter new password" required />
            <b-form-invalid-feedback :state="input.password.errMsg">{{ input.password.errMsg }}</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Confirm New Password:">
            <b-form-input v-model="input.confirm_password.value" type="password" placeholder="Enter new password again" required />
            <b-form-invalid-feedback :state="input.confirm_password.errMsg">{{ input.confirm_password.errMsg }}</b-form-invalid-feedback>
          </b-form-group>

          <b-button variant="primary" align-h="end" @click="onSubmit">Submit</b-button><br/>

          <br/>
          <router-link :to="{ name: 'login' }" custom v-slot="{ navigate }">
            <a href="#" @click="navigate">Back to login</a>
          </router-link>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { reset } from "@/api/auth.js"

export default {
  name: "ResetPassword",

  data() {
    return {
      input: {
        password: {
          value: '',
          errMsg: null
        },
        confirm_password: {
          value: '',
          errMsg: null
        }
      },
      resetObj: {
        token: this.$route.params.token,
        new_password: null,
      }
    }
  },

  created() {
    if(this.$session.flash.get("flash-message")) {
      this.$bvToast.toast(this.$session.flash.get("flash-message"), { autoHideDelay: 5000, variant: this.$session.flash.get("flash-class"), solid: true })
    }
  },

  methods: {
    onSubmit() {
      // Form Validation
      var doSubmit = true
      this.input.password.errMsg = null
      this.input.confirm_password.errMsg = null

      if (this.input.password.value == "" || this.input.password.value == null) {
        doSubmit = false
        this.input.password.errMsg = "New Password must not be empty"
      }

      if (this.input.confirm_password.value == "" || this.input.confirm_password.value == null) {
        doSubmit = false
        this.input.confirm_password.errMsg = "Confirm New Password must not be empty"
      } else if (this.input.password.value != this.input.confirm_password.value) {
        doSubmit = false
        this.input.confirm_password.errMsg = "Confirm New Password must match with New Password"
      }

      this.resetObj.new_password = this.input.password.value

      // Submit
      if (doSubmit) {
        try {
          reset(this.resetObj)
            .then((res) => {
              if (res.data.status) {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })
                this.$session.flash.set("flash-class", "success")
                this.$session.flash.set("flash-message", "Password changed successfully")

                this.$router.push({ name: "login" })
              } else {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
              }
            })
            .catch(() => {
              this.$bvToast.toast("Password failed to changed due to network error.", { autoHideDelay: 5000, variant: "danger", solid: true })
            });
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
</script>

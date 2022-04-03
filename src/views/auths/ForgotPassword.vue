<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12" md="5" class="py-5">
        <b-card>
          <h3 class="pb-2">Forgot Password</h3>

          <b-form>
            <b-form-group label="User ID:">
              <b-form-input v-model="input.user_id.value" placeholder="Enter user ID" required />
              <b-form-invalid-feedback :state="input.user_id.errMsg">{{ input.user_id.errMsg }}</b-form-invalid-feedback>
            </b-form-group>

            <b-button variant="primary" align-h="end" @click="onSubmit">Request password reset</b-button><br/>

            <br/>
            <router-link :to="{ name: 'login' }" custom v-slot="{ navigate }">
              <a href="#" @click="navigate">Back to login</a>
            </router-link>
          </b-form>

          <template #footer>
            <small class="text-muted">Developed by MieSaF</small>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { requestReset } from "@/api/auth.js"

export default {
  name: "ForgotPassword",

  data() {
    return {
      input: {
        user_id: {
          value: '',
          errMsg: null
        }
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
      this.input.user_id.errMsg = null

      if (this.input.user_id.value == "" || this.input.user_id.value == null) {
        doSubmit = false
        this.input.user_id.errMsg = "User ID is required"
      }

      // Submit
      if (doSubmit) {
        try {
          requestReset(this.input.user_id.value)
            .then((res) => {
              if (res.data.status) {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 10000, variant: "success", solid: true })
              } else {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
              }
            })
            .catch(() => {
              this.$bvToast.toast("Password reset request failed due to network error.", { autoHideDelay: 5000, variant: "danger", solid: true })
            });
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
</script>

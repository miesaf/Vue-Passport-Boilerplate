<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12" md="5" class="py-5">
        <b-card>
          <h3 class="pb-2">Login</h3>

          <b-form>
            <b-form-group label="User ID:">
              <b-form-input v-model="input.user_id.value" placeholder="Enter user ID" required />
              <b-form-invalid-feedback :state="input.user_id.errMsg">{{ input.user_id.errMsg }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Password:">
              <b-form-input type="password" v-model="input.password.value" placeholder="Enter password" required />
              <b-form-invalid-feedback :state="input.password.errMsg">{{ input.user_id.errMsg }}</b-form-invalid-feedback>
            </b-form-group>

            <b-button variant="primary" align-h="end" @click="onSubmit">Login</b-button><br/>

            <br/>
            <router-link :to="{ name: 'password.forgot' }" custom v-slot="{ navigate }">
              <a href="#" @click="navigate">Forgot password?</a>
            </router-link>
            <br/>
            <router-link :to="{ name: 'password.firstTime' }" custom v-slot="{ navigate }">
              <a href="#" @click="navigate" role="link">First time login?</a>
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
import { login } from "@/api/auth.js"
import moment from "moment"

export default {
  name: "LoginPage",

  data() {
    return {
      flash: {
        message: '',
        class: ''
      },
      input: {
        user_id: {
          value: '',
          errMsg: null
        },
        password: {
          value: '',
          errMsg: null
        }
      }
    }
  },

  created() {
    if(this.$session.flash.get("flash-class")) {
      this.$bvToast.toast(this.$session.flash.get("flash-message"), { autoHideDelay: 5000, variant: this.$session.flash.get("flash-class"), solid: true })
    }
  },

  methods: {
    onSubmit() {
      this.flash.class = null
      this.flash.message = null

      // Form Validation
      var doSubmit = true
      this.input.user_id.errMsg = null
      this.input.password.errMsg = null

      if (this.input.user_id.value == "" || this.input.user_id.value == null) {
        doSubmit = false
        this.input.user_id.errMsg = "User ID is required"
      }

      if (this.input.password.value == "" || this.input.password.value == null) {
        doSubmit = false
        this.input.password.errMsg = "Password is required"
      }

      if(this.$store.getters.authGrace) {
        const now_raw = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        const grace_end = moment(this.$store.getters.authGrace)

        if (moment(now_raw).isBefore(grace_end)) {
          doSubmit = false
          this.$bvToast.toast("You are locked from login due to multiple login failure until " + grace_end.format("hh:mm:ss A"), { autoHideDelay: 5000, variant: "danger", solid: true })
        }
      }

      // Submit
      if (doSubmit) {
        // Build request object
        var reqObj = {
          user_id: this.input.user_id.value,
          password: this.input.password.value
        }

        try {
          login(reqObj)
            .then((res) => {
              if (res.data.status) {
                this.$store
                  .dispatch("Login", res.data)
                  .then(() => {
                    this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })

                    this.$session.flash.set("flash-class", "success")
                    this.$session.flash.set("flash-message", "Login successful")
                  })
                  .then(async () => {
                    await new Promise(r => setTimeout(r, 2000));
                    await this.$router.push({ name: 'dashboard' })
                  })
                  .catch(() => {
                    this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })

                    this.flash.class = "danger"
                    this.flash.message = "Login failed"
                  });
              } else {
                this.$store
                  .dispatch("LoginAttmept", res.data)
                  .then(() => {
                    if(this.$store.getters.authGrace) {
                      this.$bvToast.toast("You are locked from login due to multiple login failure until " + moment(this.$store.authGrace).format("hh:mm:ss A"), { autoHideDelay: 5000, variant: "danger", solid: true })
                    }
                  })

                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
                if(this.$store.getters.authAttempt) {
                  this.$bvToast.toast("You have " + (this.$store.getters.authMaxAttempt - parseInt(this.$store.getters.authAttempt)) + " attempt(s) more before being locked.", { autoHideDelay: 5000, variant: "warning", solid: true })
                }

                this.flash.class = "danger"
                this.flash.message = res.data.message
              }
            })
            .catch((e) => {
              console.error(e)
              this.$bvToast.toast("Login failed due to network error", { autoHideDelay: 5000, variant: "danger", solid: true })

              this.flash.class = "danger"
              this.flash.message = "Login failed due to network error."
            });
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
</script>

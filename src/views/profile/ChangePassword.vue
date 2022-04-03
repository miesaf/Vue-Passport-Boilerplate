<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12" md="8" class="py-3">
        <h3 class="pb-2">Change Password</h3>
        
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
          <b-card-body>
            <b-form>
              <b-form-group label="Current Password:">
                <b-form-input type="password" v-model="input.oldPassword.value" placeholder="Enter current password" required />
                <b-form-invalid-feedback :state="input.oldPassword.errMsg">{{ input.oldPassword.errMsg }}</b-form-invalid-feedback>
              </b-form-group>

              <b-form-group label="New Password:">
                <b-form-input type="password" v-model="input.newPassword.value" placeholder="Enter new password" required />
                <b-form-invalid-feedback :state="input.newPassword.errMsg">{{ input.newPassword.errMsg }}</b-form-invalid-feedback>
              </b-form-group>

              <b-form-group label="Confirm New Password:">
                <b-form-input type="password" v-model="input.confirmNewPassword.value" placeholder="Enter new password again" required />
                <b-form-invalid-feedback :state="input.confirmNewPassword.errMsg">{{ input.confirmNewPassword.errMsg }}</b-form-invalid-feedback>
              </b-form-group>

              <b-button variant="primary" align-h="end" @click="onSubmit">Submit</b-button><br/>
            </b-form>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { changePassword } from '@/api/auth'

export default {
  name: "ChangePassword",

  data() {
    return {
      alert: {
        message: '',
        class: '',
        dismissCountDown: 0
      },
      input: {
        oldPassword: {
          value: '',
          errMsg: ''
        },
        newPassword: {
          value: '',
          errMsg: ''
        },
        confirmNewPassword: {
          value: '',
          errMsg: ''
        }
      }
    }
  },
  methods: {
    onSubmit() {
      // Form Validation
      var doSubmit = true
      this.input.oldPassword.errMsg = null
      this.input.newPassword.errMsg = null
      this.input.confirmNewPassword.errMsg = null

      if (this.input.oldPassword.value == "" || this.input.oldPassword.value == null) {
        doSubmit = false
        this.input.oldPassword.errMsg = "Current Password must not be empty"
      }

      if (this.input.newPassword.value == "" || this.input.newPassword.value == null) {
        doSubmit = false
        this.input.newPassword.errMsg = "New Password must not be empty"
      }

      if (this.input.confirmNewPassword.value == "" || this.input.confirmNewPassword.value == null) {
        doSubmit = false
        this.input.confirmNewPassword.errMsg = "Confirm New Password must not be empty"
      } else if (this.input.newPassword.value != this.input.confirmNewPassword.value) {
        doSubmit = false
        this.input.confirmNewPassword.errMsg = "Confirm New Password must match with New Password"
      }

      // Submit
      if (doSubmit) {
        var newPwdObj = {
          oldPassword: this.input.oldPassword.value,
          newPassword: this.input.newPassword.value,
        }

        try {
          changePassword(newPwdObj)
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
            .catch((e) => {
              var errMsg = null

              if(e.response.status && e.response.status == 422) {
                errMsg = e.response.data.message

                if(e.response.data.errors) {
                  var errObj = e.response.data.errors
                  this.input.oldPassword.errMsg = errObj.old_password ? errObj.old_password[0] : null
                  this.input.newPassword.errMsg = errObj.new_password ? errObj.new_password[0] : null
                }
              } else {
                errMsg = "Password failed to changed due to network error."
              }

              this.$bvToast.toast(errMsg, { autoHideDelay: 10000, variant: "danger", solid: true })
            });
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>

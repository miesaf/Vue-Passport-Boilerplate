<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12" md="8" class="py-3">
        <h3 class="pb-2">User Profile</h3>
        
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
            <b-row class="my-1">
              <b-col sm="3">
                <label for="user_id">User ID:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input id="user_id" type="text" :value="this.$store.getters.authUserId" readonly></b-form-input>
              </b-col>
            </b-row>
            
            <b-row class="my-1">
              <b-col sm="3">
                <label for="name">Name:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input id="name" type="text" :value="this.$store.getters.authName" readonly></b-form-input>
              </b-col>
            </b-row>
            
            <b-row class="my-1">
              <b-col sm="3">
                <label for="email">Email:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input id="email" type="text" :value="this.$store.getters.authEmail" readonly></b-form-input>
              </b-col>
            </b-row>
            
            <b-row class="my-1">
              <b-col sm="3">
                <label for="roles">Roles:</label>
              </b-col>
              <b-col sm="9">
                <p>
                  <b-badge variant="primary" v-for="role in this.$store.getters.authRoles" :key="role.id" class="mr-2 mb-2">{{ role }}</b-badge>
                </p>
              </b-col>
            </b-row>
            
            <b-row class="my-1">
              <b-col sm="3">
                <label for="permissions">Permissions:</label>
              </b-col>
              <b-col sm="9">
                <p>
                  <b-badge variant="warning" v-for="permission in this.$store.getters.authPermissions" :key="permission.id" class="mr-2 mb-2">{{ permission }}</b-badge>
                </p>
              </b-col>
            </b-row>
            
            <b-row class="my-1">
              <b-col sm="3">
                <label for="last_login">Last Login:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input id="last_login" type="text" :value="this.$store.getters.authLastLogin" readonly></b-form-input>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "UserProfile",

  data() {
    return {
      alert: {
        message: '',
        class: '',
        dismissCountDown: 0
      }
    }
  }
}
</script>

<style scoped>

</style>

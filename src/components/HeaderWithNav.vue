<template>
  <b-navbar toggleable="md" type="dark" variant="success">
    <router-link :to="{ name: 'dashboard' }" custom v-slot="{ navigate }">
      <b-navbar-brand @click="navigate">{{ appName }}</b-navbar-brand>
    </router-link>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right v-if="permited(['users.*', 'users.list', 'users.add', 'users.view', 'users.update', 'users.delete', 'auditLogs.*', 'auditLogs.list', 'auditLogs.view'])">
          <template #button-content>
            <b-icon icon="grid" /> Menu
          </template>
          <router-link :to="{ name: 'dashboard' }" custom v-slot="{ navigate }">
            <b-dropdown-item @click="navigate"><b-icon icon="house-door" /> Dashbaord</b-dropdown-item>
          </router-link>
          <router-link :to="{ name: 'users' }" custom v-slot="{ navigate }" v-if="permited(['users.*', 'users.list', 'users.add', 'users.view', 'users.update', 'users.delete'])">
            <b-dropdown-item @click="navigate"><b-icon icon="people" /> User Management</b-dropdown-item>
          </router-link>
        </b-nav-item-dropdown>

        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <template #button-content>
            <b-icon icon="person-circle" /> {{ user_id }}
          </template>
          <b-dropdown-item><b>{{ userName }}</b></b-dropdown-item>

          <b-dropdown-divider />

          <router-link :to="{ name: 'profile.detail' }" custom v-slot="{ navigate }">
            <b-dropdown-item @click="navigate"><b-icon icon="person" /> Profile</b-dropdown-item>
          </router-link>
          <router-link :to="{ name: 'profile.changePword' }" custom v-slot="{ navigate }">
            <b-dropdown-item @click="navigate"><b-icon icon="shield-lock" /> Change Password</b-dropdown-item>
          </router-link>
          <router-link :to="{ name: 'logout' }" custom v-slot="{ navigate }">
            <b-dropdown-item @click="navigate"><b-icon icon="power" /> Logout</b-dropdown-item>
          </router-link>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "TopHeader",

  data() {
    return {
      appName: process.env.VUE_APP_NAME,
      user_id: this.$store.state.user.authUserId,
      userName: this.$store.state.user.authName
    }
  },

  methods: {
    permited(permissions) {
      if(permissions) {
        var flag = false

        if(this.$store.getters.authPermissions) {
          permissions.forEach(permission => { if(this.$store.getters.authPermissions.includes(permission)) { flag = true } })
        }

        return flag
      } else {
        return true
      }
    }
  }
}
</script>

<style>

</style>
<template>
  <b-navbar toggleable="md" type="dark" variant="success">
    <b-navbar-brand href="#">{{ appName }}</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>{{ user_id }}</em>
          </template>
          <b-dropdown-item><b>{{ userName }}</b></b-dropdown-item>
          <b-dropdown-divider />
          <router-link :to="{ name: 'profile.detail' }" custom v-slot="{ navigate }">
            <b-dropdown-item @click="navigate">Profile</b-dropdown-item>
          </router-link>
          <router-link :to="{ name: 'logout' }" custom v-slot="{ navigate }">
            <b-dropdown-item @click="navigate">Logout</b-dropdown-item>
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
  }
}
</script>

<style>

</style>
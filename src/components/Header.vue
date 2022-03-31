<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-brand href="#">{{ appName }}</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-link :to="{ name: 'home' }"><b-dropdown-item>Profile</b-dropdown-item></b-link>
          <b-dropdown-item href="#">Change Password</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
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
      appName: process.env.VUE_APP_NAME
    }
  }
}
</script>

<style>

</style>
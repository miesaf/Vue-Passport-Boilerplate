<template>
  <b-navbar toggleable="md" variant="primary" class="navbar-dark">
    <b-navbar-brand href="#">{{ appName }}</b-navbar-brand>
  </b-navbar>
</template>

<script>
export default {
  name: "TopHeader",

  data() {
    return {
      appName: import.meta.env.VUE_APP_NAME
    }
  }
}
</script>

<style>

</style>
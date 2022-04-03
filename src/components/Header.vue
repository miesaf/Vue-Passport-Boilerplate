<template>
  <b-navbar toggleable="md" type="dark" variant="primary">
    <b-navbar-brand href="#">{{ appName }}</b-navbar-brand>
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
<template>
  <main>
    <Header />
    <Nav />
    <router-view />
  </main>
</template>

<script>
import Nav from '@/components/Nav'
import Header from '@/components/Header'

export default {
  name: "AppLayout",

  components: {
    Nav,
    Header
  }
}
</script>


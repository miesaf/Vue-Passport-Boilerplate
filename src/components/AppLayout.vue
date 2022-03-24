<template>
  <main>
    <Header />
    <Nav />
    <router-view />
    <Footer />
  </main>
</template>

<script>
import Nav from '@/components/Nav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: "AppLayout",

  components: {
    Nav,
    Header,
    Footer
  }
}
</script>


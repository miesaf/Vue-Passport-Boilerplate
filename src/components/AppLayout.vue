<template>
  <div class="wrapper">
    <Nav />
    
    <div class="main">
      <Header />

      <main class="content">
        <router-view/>
      </main>

      <Footer />
    </div>
  </div>
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


<template>
  <main>
    <TopHeader />
    <NavigationPanel />
    <router-view />
  </main>
</template>

<script>
import NavigationPanel from '@/components/Nav.vue'
import TopHeader from '@/components/HeaderWithNav.vue'

export default {
  name: "AppLayout",

  components: {
    NavigationPanel,
    TopHeader
  }
}
</script>


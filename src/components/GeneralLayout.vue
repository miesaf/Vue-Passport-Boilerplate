<template>
  <main>
    <TopHeader />
    <NavigationPanel />
    <router-view />
  </main>
</template>

<script>
import NavigationPanel from '@/components/Nav.vue'
import TopHeader from '@/components/Header.vue'

export default {
  name: "GeneralLayout",

  components: {
    NavigationPanel,
    TopHeader
  }
}
</script>


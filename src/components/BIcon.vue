<template>
  <i :class="['bi', 'bi-' + icon, variant ? 'text-' + variant : null]" :style="fontScale ? { fontSize: fontScale + 'em' } : null" aria-hidden="true"></i>
</template>

<script>
// Stand-in for BootstrapVue 2's <b-icon>, rendered with the bootstrap-icons font.
export default {
  name: "BIcon",

  props: {
    icon: { type: String, required: true },
    variant: { type: String, default: null },
    fontScale: { type: [String, Number], default: null }
  }
}
</script>

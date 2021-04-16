<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>

<script>
import { ref } from 'vue'
import useScroll from './use-scroll'
export default {
  name: 'Scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['onScroll'],
  setup (props, ctx) {
    const rootRef = ref(null)
    const { bs } = useScroll(rootRef, props, ctx)
    return {
      rootRef,
      bs
    }
  }
}
</script>

<style>
</style>

<template>
  <m-header />
  <m-tab />
  <router-view />
</template>
<script>
import MHeader from '@/components/header/header.vue'
import MTab from '@/components/tab/index.vue'
export default {
  components: {
    MHeader,
    MTab
  }
}
</script>

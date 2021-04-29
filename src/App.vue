<template>
  <m-header />
  <m-tab />
  <router-view />
  <player />
</template>
<script>
import MHeader from '@/components/header/header.vue'
import MTab from '@/components/tab/index.vue'
import Player from '@/components/play/index.vue'
export default {
  components: {
    MHeader,
    MTab,
    Player
  }
}
</script>

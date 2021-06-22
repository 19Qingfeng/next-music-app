<template>
  <m-header />
  <m-tab />
  <router-view :style="viewStyle" />
  <player />
</template>
<script>
import MHeader from '@/components/header/header.vue'
import MTab from '@/components/tab/index.vue'
import Player from '@/components/player/index.vue'
import { mapState } from 'vuex'
export default {
  components: {
    MHeader,
    MTab,
    Player
  },
  computed: {
    ...mapState(['playList']),
    viewStyle() {
      const bottom = this.playList.length ? '80px' : '0'
      return {
        bottom
      }
    }
  }
}
</script>

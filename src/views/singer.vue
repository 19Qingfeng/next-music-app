<template>
  <div class="singer" v-loading:[loadingText]="!singers.length">
    <index-list :data="singers" />
  </div>
</template>

<script>
import IndexList from '@/components/index-list/index.vue'
import { getSingerList } from '../service/singer'
export default {
  components: {
    IndexList
  },
  data () {
    return {
      singers: [],
      loadingText: '歌手在跑来的路上'
    }
  },
  async created () {
    const { singers } = await getSingerList()
    this.singers = singers
  }
}
</script>

<style lang='scss' scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>

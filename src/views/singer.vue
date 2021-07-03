<template>
  <div class="singer" v-loading:[loadingText]="!singers.length">
    <index-list :data="singers" @selected="selectedSinger" />
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import IndexList from '@/components/index-list/index.vue'
import { getSingerList } from '../service/singer'
import { SINGER_SESSION } from '@/assets/js/constant'
import { session } from '../utils/index'
export default {
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      singer: null,
      loadingText: '歌手在跑来的路上'
    }
  },
  methods: {
    selectedSinger(singer) {
      this.singer = singer
      this.cacheSession(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSession(singer) {
      session.set(SINGER_SESSION, singer)
    }
  },
  async created() {
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

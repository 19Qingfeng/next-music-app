<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="name" :loading="loading" />
  </div>
</template>

<script>
import { getSingerDetail } from '../service/singer'
import MusicList from '../components/music-list'
export default {
  name: 'sing-detail',
  props: {
    singer: {
      type: Object
    }
  },
  data () {
    return {
      songs: [],
      loading: false
    }
  },
  computed: {
    pic () {
      return this.singer && this.singer.pic
    },
    name () {
      return this.singer && this.singer.name
    }
  },
  components: {
    MusicList
  },
  async created () {
    this.loading = true
    const { songs } = await getSingerDetail(this.singer)
    this.loading = false
    this.songs = songs
  }
}

</script>
<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background;
  .bg-img {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
  }
}
</style>

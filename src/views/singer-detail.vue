<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="name" :loading="loading" />
  </div>
</template>

<script>
import { getSingerDetail } from '../service/singer'
import { processSongs } from '../service/songs'
import MusicList from '../components/music-list'
import { SINGER_SESSION } from '@/assets/js/constant'
import { session } from '../utils/index'
export default {
  name: 'sing-detail',
  props: {
    singer: {
      type: Object
    }
  },
  data() {
    return {
      songs: [],
      loading: false
    }
  },
  computed: {
    computedSinger() {
      let ret = null
      const singer = this.singer
      if (singer) {
        ret = singer
      } else {
        const sessionSinger = session.get(SINGER_SESSION)
        if (sessionSinger.mid === this.$route.params.id) {
          ret = sessionSinger
        }
      }
      return ret
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    name() {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  components: {
    MusicList
  },
  async created() {
    const computedSinger = this.computedSinger
    if (!computedSinger) {
      const path = this.$route.matched[0]
      this.$router.push(path)
      return
    }
    this.loading = true
    const { songs } = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(songs)
    this.loading = false
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

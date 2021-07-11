import MusicList from '@/components/music-list'
import { session } from '@/utils/index'
import { processSongs } from '@/service/songs'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    props: {
      data: {
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
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = session.get(key)
          if (cached.mid.toString() === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      name() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    components: {
      MusicList
    },
    async created() {
      const cached = this.computedData
      if (!cached) {
        const path = this.$route.matched[0]
        this.$router.push(path)
        return
      }
      this.loading = true
      const { songs } = await fetch(cached)
      this.songs = await processSongs(songs)
      this.loading = false
    }
  }
}

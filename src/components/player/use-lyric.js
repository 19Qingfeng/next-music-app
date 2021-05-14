import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/songs'
import Lyric from 'lyric-parser'

export default function useLyric () {
  const store = useStore()

  // vuex
  const currentSong = computed(() => {
    return store.getters.currentSong
  })

  // watch
  watch(currentSong, async song => {
    const lyric = await getLyric(song)
    store.commit('setSongLyric', {
      lyric,
      song
    })
    // 切换过快 异步请求返回中途歌曲 会造成currentSong和song不同步
    // currentSong已经变成最新的 但是song因为闭包+xhr前后顺序 不判断因为网络原因会出问题(错乱)
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 只有最新当前歌词才会进入下面逻辑（页面渲染最新)
    const currentLyric = new Lyric(lyric, handle)
    console.log(currentLyric, 'lyric')
    function handle () {}
  })

  return {
    currentSong
  }
}

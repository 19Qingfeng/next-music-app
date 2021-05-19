import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/songs'
import Lyric from 'lyric-parser'

export default function useLyric () {
  const store = useStore()
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
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
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 只有最新当前歌词才会进入下面逻辑（页面渲染最新)
    currentLyric.value = new Lyric(lyric, handleLyric)
  })

  function handleLyric () {
    //
  }

  return {
    currentLyric,
    currentLineNum
  }
}

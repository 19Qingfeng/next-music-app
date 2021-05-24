import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/songs'
import Lyric from 'lyric-parser'

export default function useLyric (songReady, currentTime) {
  const store = useStore()
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  // vuex
  const currentSong = computed(() => {
    return store.getters.currentSong
  })

  // watch
  watch(currentSong, async song => {
    if (!song.url || !song.id) {
      return
    }
    stopLyric()
    currentLyric.value = null
    pureMusicLyric.value = ''
    playingLyric.value = ''
    currentLineNum.value = 0
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
    if (currentLyric.value.lines.length > 0) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(
        /\[(\d{2}):(\d{2}):(\d{2})\]/g,
        ''
      )
    }
  })

  function playLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyric.value.seek(currentTime.value * 1000)
    }
  }

  function stopLyric () {
    if (currentLyric.value) {
      currentLyric.value.stop()
    }
  }

  function handleLyric ({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollCmp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      const ele = listEl.children[lineNum - 5]
      scrollCmp.bs.scrollToElement(ele, 1000)
    } else {
      scrollCmp.bs.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric
  }
}

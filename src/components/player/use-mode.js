import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode () {
  const store = useStore()

  const playMode = computed(() => {
    return store.state.playMode
  })

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.loop
        ? 'icon-loop'
        : 'icon-random'
  })

  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.loop
        ? '循环播放'
        : '随机播放'
  })

  const changeMode = () => {
    const playModeVal = playMode.value
    const mode = (playModeVal + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return {
    playMode,
    modeText,
    modeIcon,
    changeMode
  }
}

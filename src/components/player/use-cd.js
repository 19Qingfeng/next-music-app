import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCd () {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const store = useStore()

  // vuex
  const playing = computed(() => {
    return store.state.playing
  })

  // computed
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncTransformRotate(cdRef.value, cdImageRef.value)
    }
  })

  // methods
  function syncTransformRotate (wrapper, inner) {
    const innerTransform = getComputedStyle(inner).transform
    const wrapperTransform = getComputedStyle(wrapper).transform
    wrapper.style.transform =
      innerTransform +
      '' +
      (wrapperTransform === 'none' ? '' : wrapperTransform) // 转动加上之前的
  }

  return {
    cdRef,
    cdImageRef,
    cdCls
  }
}

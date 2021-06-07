import { ref, onMounted, computed, watch, nextTick } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { useStore } from 'vuex'

BScroll.use(Slide)

export default function useMiniSlide () {
  const sliderRef = ref(null)
  const slide = ref(null)
  const store = useStore()

  const fullScreen = computed(() => {
    return store.state.fullScreen
  })
  const playList = computed(() => {
    return store.state.playList
  })
  const isShowSlider = computed(() => {
    return fullScreen.value && !!playList.value.length
  })

  onMounted(() => {
    let slideVal
    watch(isShowSlider, async isShow => {
      await nextTick()
      if (isShow) {
        if (!slideVal) {
          // 初始化参数不对 需要调整
          slideVal = slide.value = new BScroll(sliderRef.value, {
            scrollX: true,
            scrollY: false,
            slide: {
              autoplay: false
            },
            momentum: false,
            bounce: false,
            stopPropagation: true
          })
        } else {
          // 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
          slideVal.refresh()
        }
      }
    })
  })

  return {
    sliderRef
  }
}

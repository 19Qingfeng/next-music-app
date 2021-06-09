import { ref, onMounted, computed, watch, nextTick } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { useStore } from 'vuex'

BScroll.use(Slide)

export default function useMiniSlide() {
  const sliderRef = ref(null)
  const slide = ref(null)
  const store = useStore()

  const fullScreen = computed(() => {
    return store.state.fullScreen
  })
  const playList = computed(() => {
    return store.state.playList
  })
  const currentIndex = computed(() => {
    return store.state.currentIndex
  })
  const isShowSlider = computed(() => {
    return !fullScreen.value && !!playList.value.length
  })

  // 滑动切换slider
  function slidePageChanged({ pageX }) {
    store.commit('setCurrentIndex', pageX)
  }

  onMounted(() => {
    let slideVal
    watch(isShowSlider, async isShow => {
      if (isShow) {
        await nextTick()
        if (!slideVal) {
          // 初始化参数不对 需要调整
          slideVal = slide.value = new BScroll(sliderRef.value, {
            scrollX: true,
            scrollY: false,
            slide: {
              autoplay: false,
              loop: true
            },
            momentum: false,
            bounce: false,
            stopPropagation: true,
            click: true
          })
          slideVal.on('slidePageChanged', slidePageChanged)
        } else {
          slideVal.refresh()
        }
        slideVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 歌曲自动完成
    watch(currentIndex, newIndex => {
      if (slideVal && isShowSlider.value) {
        slideVal.goToPage(newIndex, 0, 0)
      }
    })

    // playList改变
    watch(playList, async newList => {
      if (slideVal && isShowSlider.value) {
        await nextTick()
        slideVal.refresh()
      }
    })
  })

  return {
    sliderRef
  }
}

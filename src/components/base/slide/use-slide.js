import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlide (wrapper) {
  const currentPageIndex = ref(0)
  let bsScroll
  onMounted(() => {
    bsScroll = new BScroll(wrapper.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      slide: true,
      probeType: 2
    })
    bsScroll.on('slideWillChange', ({ pageX }) => {
      currentPageIndex.value = pageX
    })
  })
  onUnmounted(() => {
    bsScroll.destroy()
  })
  return {
    currentPageIndex
  }
}

import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted } from '@vue/runtime-core'

BScroll.use(ObserveDOM)

export default function useScroll (wrapperRef, option) {
  let bs
  onMounted(() => {
    bs = new BScroll(wrapperRef.value, {
      observeDOM: true, // 开启 observe-dom 插件
      ...option
    })
  })
  onUnmounted(() => {
    bs.destroy()
  })
}

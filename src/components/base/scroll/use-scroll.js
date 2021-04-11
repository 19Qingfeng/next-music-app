import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted } from '@vue/runtime-core'

BScroll.use(ObserveDOM)

export default function useScroll (wrapperRef, option) {
  let bs
  onMounted(() => {
    // bs 判断能否滚动是在初始化时候根据容器和内容高度进行判别
    // 初始化时内容并没有 不满足滚动插件 所以调用observeDOM 监听DOM变化自动调用refresh() 重新计算刷新
    bs = new BScroll(wrapperRef.value, {
      observeDOM: true, // 开启 observe-dom 插件
      ...option
    })
  })
  onUnmounted(() => {
    bs.destroy()
  })
}

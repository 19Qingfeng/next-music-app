import { computed } from 'vue'

export default function seShortCur (props, scrollWrapper, rootRef) {
  const ANCHOR_HEIGHT = 18
  const shortTitle = computed(() => {
    return props.data.map(i => i.title)
  })
  const touch = {}
  const onTouchStart = event => {
    const index = parseInt(event.target.dataset.index)
    touch.y1 = event.touches[0].pageY
    touch.startIndex = index
    scrollTo(index)
  }
  const onTouchMove = event => {
    touch.y2 = event.touches[0].pageY
    // | 运算符 两位有一个为1 全置为1
    // 正数取最小正整数 负数取最大负整数
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    const index = touch.startIndex + delta
    scrollTo(index)
  }

  function scrollTo (index) {
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortTitle.value.length - 1, index))
    const bs = scrollWrapper.value.bs
    const el = rootRef.value.children[index]
    bs.scrollToElement(el, 200)
  }
  return {
    shortTitle,
    onTouchStart,
    onTouchMove
  }
}

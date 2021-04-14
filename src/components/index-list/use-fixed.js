import { nextTick, ref, watch, computed } from 'vue'

export default function useFixed (props) {
  const rootRef = ref(null)
  const heightList = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const item = props.data[currentIndex.value]
    return item ? item.title : ''
  })

  function calculate () {
    let distance = 0
    const list = heightList.value
    const child = rootRef.value.children
    list.length = 0
    list.push(distance)
    for (const li of child) {
      const height = li.clientHeight
      distance += height
      list.push(distance)
    }
  }

  function onScroll (position) {
    scrollY.value = -position.y
  }

  // 触发滚动 scrollY变化实时计算title
  watch(scrollY, () => {
    const list = heightList.value
    for (let i = 0; i < list.length - 1; i++) {
      const topPosition = list[i]
      const bottomPosition = list[i + 1]
      if (scrollY.value >= topPosition && scrollY.value < bottomPosition) {
        currentIndex.value = i
        break
      }
    }
  })

  // 数据变化重新计算
  watch(
    () => props.data,
    async () => {
      await nextTick()
      calculate()
    }
  )
  return {
    rootRef,
    fixedTitle,
    onScroll
  }
}

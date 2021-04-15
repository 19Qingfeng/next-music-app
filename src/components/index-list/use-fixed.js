import { nextTick, ref, watch, computed } from 'vue'
/*
   思路
   1:数据变化,watch nextTick 计算每个li的高度组成的list
   2:scroll滚动 计算顶部距离的Y下标，看落点在什么区间得到下标值(就得到了Array中的落点当前值)

   3. 计算每个ul底部距离wrapper顶部的距离，如果足够小(小于顶部fixedTitle的高度)开始偏移。
   4. fixedTitle这一个div偏移量为 距离wrapper顶部的高度 - fixed的高度。(当足够小的时候)
   5. 当变化了title的时候，此时index变化距离也会变化，距离就不会足够小了。偏移量重新置为0.
   6. 当前ul距离wrapper的距离可以通过 ul距离document的高度 - scroll滚动的Y值(已经被隐藏的Y值)计算。
*/
export default function useFixed (props) {
  const rootRef = ref(null)
  const heightList = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const LI_HEIGHT = 30
  const distance = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const item = props.data[currentIndex.value]
    return item ? item.title : ''
  })

  const transformStyle = computed(() => {
    if (distance.value > 0 && distance.value < LI_HEIGHT) {
      return `transform:translate3D(0,${distance.value - LI_HEIGHT}px,0)`
    } else {
      return 'transform:translate3D(0,0,0)'
    }
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
  watch(scrollY, newY => {
    const list = heightList.value
    for (let i = 0; i < list.length - 1; i++) {
      const topPosition = list[i]
      const bottomPosition = list[i + 1]
      if (scrollY.value >= topPosition && scrollY.value < bottomPosition) {
        currentIndex.value = i
        distance.value = bottomPosition - newY
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
    transformStyle,
    onScroll
  }
}

import { computed } from 'vue'

export default function seShortCur (props, scrollWrapper, rootRef) {
  const shortTitle = computed(() => {
    return props.data.map(i => i.title)
  })
  const onTouchStart = event => {
    const index = event.target.dataset.index
    scrollTo(index)
  }
  const onTouchmove = event => {
    console.log(event.target, 'event.target')
  }
  const onTouchEnd = event => {
    //
  }

  function scrollTo (index) {
    const bs = scrollWrapper.value.bs
    const el = rootRef.value.children[index]
    bs.scrollToElement(el, 200)
  }
  return {
    shortTitle,
    onTouchStart,
    onTouchmove,
    onTouchEnd
  }
}

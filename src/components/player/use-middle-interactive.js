import { ref } from 'vue'

export default function useMiddleInteractive () {
  const currentShow = ref('cd')
  const middleLStyle = ref('')
  const middleRStyle = ref('')

  const touch = {}
  let currentView = 'cd'

  function onTouchStart (e) {
    const startX = e.touches[0].pageX
    touch.startX = startX
  }

  function onTouchMove (e) {
    const deltaX = e.touches[0].pageX - touch.startX
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offset = Math.min(0, Math.max(-window.innerWidth, deltaX + left))
    const percent = Math.abs(offset / window.innerWidth)
    touch.percent = percent

    if (currentView === 'cd') {
      if (percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - percent,
      transitionDuration: '0ms'
    }

    middleRStyle.value = {
      transform: `translate3d(${offset}px,0,0)`,
      transitionDuration: '0ms'
    }
  }

  function onTouchEnd () {
    let offset
    let opacity
    const currentVal = currentShow.value
    if (currentVal === 'cd') {
      offset = '0%'
      opacity = 1
    } else {
      offset = '-100%'
      opacity = 0
    }
    currentView = currentVal
    middleLStyle.value = {
      opacity,
      transitionDuration: '300ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offset},0,0)`,
      transitionDuration: '300ms'
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

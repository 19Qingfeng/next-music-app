import { ref, watch } from 'vue'

export default function useMiddleInteractive (currentSong) {
  const currentShow = ref('cd')
  const middleLStyle = ref('')
  const middleRStyle = ref('')

  const touch = {}
  let currentView = 'cd'

  watch(currentSong, () => {
    resetCurrentShow()
  })

  function resetCurrentShow () {
    currentView = 'cd'
    currentShow.value = 'cd'
    middleLStyle.value = {
      opacity: 1,
      transitionDuration: '0ms'
    }

    middleRStyle.value = {
      transform: 'translate3d(0,0,0)',
      transitionDuration: '0ms'
    }
  }

  function onTouchStart (e) {
    const startX = e.touches[0].pageX
    const startY = e.touches[0].pageY
    touch.startX = startX
    touch.startY = startY
    touch.lockDirection = ''
  }

  function onTouchMove (e) {
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    console.log(absDeltaX, 'absDeltaX')
    console.log(absDeltaY, 'deltaY')

    // 第一次就会决定 然后本次滚动就会锁住了 直到重新touchStart才会开锁
    if (!touch.lockDirection) {
      touch.lockDirection = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    if (touch.lockDirection === 'v') {
      return
    }

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

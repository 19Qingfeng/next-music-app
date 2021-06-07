import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref(null)
  let entering = false
  let leaving = false

  function enter(el, done) {
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()
    // 创建动画
    const move = {
      '0%': {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      '100%': {
        transform: 'translate3d(0px,0px,0px) scale(1)'
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation: move,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function afterEnter() {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.style.animation = ''
  }

  function leave(el, done) {
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperRefVal = cdWrapperRef.value
    cdWrapperRefVal.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperRefVal.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`

    cdWrapperRefVal.addEventListener('transitionend', next)

    function next() {
      cdWrapperRefVal.removeEventListener('transitionend', next)
      done()
    }
  }

  function afterLeave() {
    leaving = false
    const cdWrapperRefVal = cdWrapperRef.value
    cdWrapperRefVal.style.transition = ''
    cdWrapperRefVal.style.transform = ''
  }

  function getPosAndScale() {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingTop = 80
    const paddingBottom = 30
    const cdWidth = window.innerWidth * 0.8

    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - cdWidth / 2 - paddingBottom
    const scale = targetWidth / cdWidth

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}

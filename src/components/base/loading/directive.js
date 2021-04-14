import Loading from './index.vue'
import { addClass, removeClass } from '@/utils/dom'
import { createApp } from 'vue'

const reactiveClass = 'g-reactive'

const directive = {
  mounted (el, binding) {
    const instance = createApp(Loading).mount(document.createElement('div'))
    el.instance = instance
    const title = binding.arg
    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }
    if (binding.value) {
      append(el, instance.$el)
    }
  },
  updated (el, binding) {
    const dom = el.instance.$el
    const title = binding.arg
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el, dom) : remove(el, dom)
    }
  }
}

function append (el, child) {
  el.appendChild(child)
  const style = getComputedStyle(el)
  if (['reactive', 'fixed', 'absolute'].indexOf(style.position) === -1) {
    addClass(el, reactiveClass)
  }
}

function remove (el, child) {
  el.removeChild(child)
  removeClass(el, reactiveClass)
}

export default directive

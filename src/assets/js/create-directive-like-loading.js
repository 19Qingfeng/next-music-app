import { addClass, removeClass } from '@/utils/dom'
import { createApp } from 'vue'

const reactiveClass = 'g-reactive'

export default function createDirectiveLikeLoading (component) {
  const name = component.name

  return {
    mounted (el, binding) {
      // createApp receives a root component options object as a first parameter  -- Returns an application instance
      // mount() return The root component instance
      const instance = createApp(component).mount(
        document.createElement('div')
      )
      if (!el._customLoading) {
        el._customLoading = {}
      }
      el._customLoading[name] = instance
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }
      if (binding.value) {
        append(el, instance.$el)
      }
    },
    updated (el, binding) {
      const dom = el._customLoading[name].$el
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el._customLoading[name].setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el, dom) : remove(el, dom)
      }
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

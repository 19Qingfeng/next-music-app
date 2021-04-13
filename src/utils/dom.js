export function addClass (el, className) {
  if (el.classList.contains(className)) return
  el.classList.add(className)
}

export function removeClass (el, className) {
  el.classList.remove(className)
}

export function formatTime (value) {
  value = value | 0 // 向下取整
  const minute = (((value / 60) | 0) + '').padStart(2, '0')
  const second = ((value % 60) + '').padStart(2, '0')
  return `${minute}:${second}`
}

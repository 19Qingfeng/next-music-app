import { Storage } from 'wind-library'

const local = Storage.local

function insertArray (item, arr, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  if (maxLen && arr.length >= maxLen) {
    arr.pop()
  }
  arr.unshift(item)
}

function removeArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save (item, key, compare, maxLen) {
  const arr = local.get(key) || []
  insertArray(item, arr, compare, maxLen)
  local.set(key, arr)
  return arr
}

export function remove (key, compare) {
  const arr = local.get(key) || []
  removeArray(arr, compare)
  local.set(key, arr)
  return arr
}

export function load (key) {
  const arr = local.get(key) || []
  return arr
}

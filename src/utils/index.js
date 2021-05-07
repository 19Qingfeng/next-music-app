import { Storage } from 'wind-library'
const session = Storage.session

function shuffle (source) {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt (max) {
  return Math.floor(Math.random() * (max + 1))
}

function swap (arr, i, j) {
  const tem = arr[i]
  arr[i] = arr[j]
  arr[j] = tem
}

export { session, shuffle }

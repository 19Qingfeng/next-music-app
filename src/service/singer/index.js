import { get } from '../config/index'

export function getSingerList (params) {
  return get('/api/getSingerList', params)
}

export function getSingerDetail (singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}

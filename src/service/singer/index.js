import { get } from '../config/index'

export function getSingerList (params) {
  return get('/api/getSingerList', params)
}

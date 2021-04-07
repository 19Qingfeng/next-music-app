import { get } from '../config/index'

export function getRecommend (params) {
  return get('/api/getRecommend', params)
}

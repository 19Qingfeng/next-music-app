import { get } from '../config/index'

export function getRecommend(params) {
  return get('/api/getRecommend', params)
}

export function getAlbum(album) {
  return get('/api/getAlbum', {
    id: album.id
  })
}

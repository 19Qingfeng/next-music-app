import { get } from '../config'

export function processSongs (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map(song => {
      return song.mid
    })
  }).then(result => {
    const map = result.map
    return songs
      .map(song => {
        song.url = map[song.mid]
        return song
      })
      .filter(song => {
        return song.url && song.url.indexOf('vkey') > -1
      })
  })
}

const lyricList = {}

export function getLyric (song) {
  const mid = song.mid
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  if (mid in lyricList) {
    return Promise.resolve(lyricList[mid])
  }

  return get('/api/getLyric', {
    mid
  }).then(res => {
    const lyric = res ? res.lyric : '[00:00:00]该歌曲暂无歌词'
    lyricList[song.mid] = lyric
    return lyric
  })
}

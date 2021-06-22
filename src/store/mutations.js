const mutations = {
  setPlayingState(state, playing) {
    state.playing = playing
  },
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  setPlayList(state, playList) {
    state.playList = playList
  },
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  setFullScreen(state, boolean) {
    state.fullScreen = boolean
  },
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
  setSongLyric(state, { song, lyric }) {
    const currentSong = state.sequenceList.find(i => i.mid === song.mid)
    if (!currentSong) {
      return
    }
    currentSong.lyric = lyric
  }
}

export default mutations

const mutations = {
  setPlayingState (state, playing) {
    state.playing = playing
  },
  setSequenceList (state, list) {
    state.sequenceList = list
  },
  setPlayList (state, playList) {
    state.playList = playList
  },
  setPlayMode (state, mode) {
    state.playMode = mode
  },
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  setFullScreen (state, boolean) {
    state.fullScreen = boolean
  }
}

export default mutations

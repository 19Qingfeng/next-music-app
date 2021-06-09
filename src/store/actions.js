import { PLAY_MODE } from '@/assets/js/constant.js'
import { shuffle } from '@/utils/index'

export function selectPlay({ commit }, { list, index }) {
  commit('setPlayingState', true)
  commit('setSequenceList', list)
  commit('setPlayList', list)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
}

export function randomPlay({ commit }, list) {
  commit('setPlayingState', true)
  commit('setSequenceList', list)
  commit('setPlayList', shuffle(list))
  commit('setPlayMode', PLAY_MODE.random)
  commit('setCurrentIndex', 0)
  commit('setFullScreen', true)
}

export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  const index = state.playList.findIndex(song => {
    return song.id === currentId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

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

// 删除歌曲逻辑还没开始写
export function removeSong({ state, commit }, song) {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const playIndex = findIndex(playList, song)
  const sequenceIndex = findIndex(sequenceList, song)

  if (playIndex === -1 || sequenceIndex === -1) {
    return
  }

  playList.splice(playIndex, 1)
  sequenceList.splice(sequenceIndex, 1)
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit('setPlayList', playList)
  commit('setSequenceList', sequenceList)
  commit('setCurrentIndex', currentIndex)
  if (playList.length === 0) {
    commit('setPlayingState', false)
  }

  function findIndex(list, item) {
    return list.findIndex(i => i.id === item.id)
  }
}

export function clearSongList({ commit }) {
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setPlayingState', false)
  commit('setCurrentIndex', 0)
}

import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite () {
  const store = useStore()
  const manxLen = 10

  const favoriteList = computed(() => {
    return store.state.favoriteList
  })

  function toggleFavorite (song) {
    // nice 修改storage方法后 返回修改后的Arr 在进行commit同步修改vuex
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, manxLen)
    }
    store.commit('setFavoriteList', list)
    function compare (i) {
      return i.id === song.id
    }
  }

  function getFavorite (song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function isFavorite (song) {
    return favoriteList.value.findIndex(i => i.id === song.id) > -1
  }

  return {
    getFavorite,
    toggleFavorite
  }
}

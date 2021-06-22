<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="playList.length && visible" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click.stop="changeMode"></i>
              <span class="text">
                {{ modeText }}
              </span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll class="list-content" ref="scrollRef">
            <transition-group name="list" tag="ul" ref="listRef">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="toggleCurrentSong(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavorite(song)"></i>
                </span>
                <span
                  class="delete"
                  :class="{ disable: removing }"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="confirmRef"
          text="是否清空播放列表"
          confirm-btn-text="清空"
          @confirm="onConfirmClear"
        />
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from '@/components/base/scroll'
import Confirm from '@/components/base/confirm'
import useModel from './use-mode'
import useFavorite from './use-favorite'
import { useStore } from 'vuex'
import { computed, nextTick, ref, watch } from '@vue/runtime-core'
export default {
  name: 'PlayList',
  components: {
    Scroll,
    Confirm
  },
  setup() {
    const visible = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)
    const removing = ref(false)

    const store = useStore()

    const playList = computed(() => store.state.playList)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    const { modeIcon, modeText, changeMode } = useModel()
    const { getFavorite, toggleFavorite } = useFavorite()

    watch(currentSong, async (newSong) => {
      if (visible.value && newSong?.id) {
        await nextTick()
        scrollToCurrentSong()
      }
    })

    function getCurrentIcon(song) {
      if (currentSong.value.id === song.id) {
        return 'icon-play'
      }
    }

    function toggleCurrentSong(song) {
      const index = playList.value.findIndex(i => i.id === song.id)
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }

    function scrollToCurrentSong() {
      const sequenceListVal = sequenceList.value
      const scrollEl = scrollRef.value
      const listEl = listRef.value.$el
      const index = sequenceListVal.findIndex(song => song.id === currentSong.value.id)
      if (index === -1) {
        return
      }
      const el = listEl.children[index]
      scrollEl.bs.scrollToElement(el, 1000)
    }

    function removeSong(song) {
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      if (playList.value.length === 0) {
        hide()
      }
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    async function show() {
      visible.value = true
      await nextTick()
      scrollRef.value.refreshScroll()
      scrollToCurrentSong()
    }

    function hide() {
      visible.value = false
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    function onConfirmClear() {
      store.dispatch('clearSongList')
      hide()
    }

    return {
      removing,
      visible,
      scrollRef,
      confirmRef,
      listRef,
      playList,
      sequenceList,
      getCurrentIcon,
      hide,
      show,
      toggleCurrentSong,
      removeSong,
      showConfirm,
      onConfirmClear,
      // icon
      modeText,
      modeIcon,
      changeMode,
      // favorite
      getFavorite,
      toggleFavorite
    }
  }
}
</script>

<style lang='scss' scope>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .list-enter-active,
      .list-leave-active {
        transition: all 0.3s;
      }
      .list-enter-from,
      .list-leave-to {
        height: 0 !important;
      }
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>

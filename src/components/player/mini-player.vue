<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            ref="cdImageRef"
            :class="cdCls"
            width="40"
            height="40"
            :src="currentSong.pic"
          />
        </div>
      </div>
      <div class="slide-wrapper" ref="sliderRef">
        <div class="slide-group">
          <div class="slide-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progress-circle>
      </div>
    </div>
  </transition>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import useCd from './use-cd'
import useMiniSlider from './use-mini-slider'
import ProgressCircle from './progress-circle'

export default {
  name: 'MiniPlayer',
  components: {
    ProgressCircle
  },
  props: {
    progress: Number
  },
  setup () {
    const store = useStore()

    const currentSong = computed(() => {
      return store.getters.currentSong
    })
    const fullScreen = computed(() => {
      return store.state.fullScreen
    })
    const playList = computed(() => {
      return store.state.playList
    })
    const playing = computed(() => {
      return store.state.playing
    })
    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    })

    const {
      cdRef,
      cdImageRef,
      cdCls
    } = useCd()
    const { sliderRef } = useMiniSlider()

    function showNormalPlayer () {
      store.commit('setFullScreen', true)
    }

    function togglePlay () {
      store.commit('setPlayingState', !playing.value)
    }
    return {
      currentSong,
      fullScreen,
      playList,
      miniPlayIcon,
      cdRef,
      cdImageRef,
      cdCls,
      showNormalPlayer,
      togglePlay,
      // mini-slider
      sliderRef
    }
  }
}
</script>
<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slide-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slide-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slide-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>

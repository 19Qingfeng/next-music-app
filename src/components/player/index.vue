<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" alt="" />
      </div>
      <div class="top">
        <div class="back">
          <i class="icon-back" @click="goBack"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar ref="barRef" :progress="progress"></progress-bar>
          </div>
          <span class="time time-r">{{
            formatTime(currentSong.duration)
          }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="preve" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i
              :class="getFavorite(currentSong)"
              @click="toggleFavorite(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="canplay"
      @error="error"
      @timeupdate="timeupdate"
    ></audio>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { formatTime } from '@/assets/js/utils'
import useModel from './use-mode'
import useFavorite from './use-favorite'
import ProgressBar from './progress-bar.vue'

export default defineComponent({
  name: 'Player',
  components: {
    ProgressBar
  },
  setup () {
    const store = useStore()
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)

    // vuex
    const currentSong = computed(() => {
      return store.getters.currentSong
    })
    const currentIndex = computed(() => {
      return store.state.currentIndex
    })
    const fullScreen = computed(() => {
      return store.state.fullScreen
    })
    const playing = computed(() => {
      return store.state.playing
    })
    const palyList = computed(() => {
      return store.state.playList
    })

    // computed
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })
    const progress = computed(() => {
      return (currentTime.value / currentSong.value.duration) * 100
    })

    // hooks
    const { modeIcon, changeMode } = useModel()
    const { getFavorite, toggleFavorite } = useFavorite()

    // watch
    watch(playing, (val) => {
      const audio = audioRef.value
      if (!songReady.value) {
        return
      }
      val ? audio.play() : audio.pause()
    })

    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      currentTime.value = 0
      songReady.value = false
      const audio = audioRef.value
      audio.src = newSong.url
      audio.play()
    })

    // methods
    const togglePlay = () => {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingState', !playing.value)
    }

    const pause = () => {
      store.commit('setPlayingState', false)
    }

    const timeupdate = (e) => {
      // e.timeStamp 返回系统启动至今的毫秒数
      currentTime.value = e.target.currentTime // 这才是歌曲当前时间
    }

    const preve = () => {
      const index = currentIndex.value
      const list = palyList.value
      if (list.length === 0 || !songReady.value) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let currentIndex = index - 1
        if (currentIndex === -1) {
          currentIndex = list.length - 1
        }
        store.commit('setCurrentIndex', currentIndex)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    const next = () => {
      const index = currentIndex.value
      const list = palyList.value
      if (list.length === 0 || !songReady.value) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let currentIndex = index + 1
        if (currentIndex === list.length) {
          currentIndex = 0
        }
        store.commit('setCurrentIndex', currentIndex)
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    const canplay = () => {
      if (songReady.value) {
        return
      }
      songReady.value = true
    }

    const error = () => {
      songReady.value = true
    }

    const goBack = () => {
      store.commit('setFullScreen', false)
    }

    function loop () {
      const audio = audioRef.value
      audio.currentTime = 0
      audio.play()
    }
    return {
      currentTime,
      currentSong,
      fullScreen,
      audioRef,
      playIcon,
      progress,
      disableCls,
      togglePlay,
      pause,
      timeupdate,
      preve,
      next,
      canplay,
      error,
      goBack,
      formatTime,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavorite,
      toggleFavorite
    }
  }
})
</script>
<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 150;
    background: $color-background;
  }
  .background {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .top {
    position: relative;
    margin-bottom: 25px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
    }
    .icon-back {
      display: block;
      padding: 9px;
      font-size: $font-size-large-x;
      color: $color-theme;
      transform: rotate(-90deg);
    }
    .title {
      width: 70%;
      margin: 0 auto;
      line-height: 40px;
      text-align: center;
      @include no-wrap();
      font-size: $font-size-large;
      color: $color-text;
    }
    .subtitle {
      line-height: 20px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0px auto;
      padding: 10px 0;
      .time {
        color: $color-text;
        font-size: $font-size-small;
        flex: 0 0 40px;
        line-height: 30px;
        width: 40px;
        &.time-l {
          text-align: left;
        }
        &.time-r {
          text-align: right;
        }
      }
      .progress-bar-wrapper {
        flex: 1;
      }
    }
    .operators {
      display: flex;
      align-items: center;
      .icon {
        flex: 1;
        color: $color-theme;
        &.disable {
          color: $color-theme-d;
        }
        i {
          font-size: 30px;
        }
      }
      .i-left {
        text-align: right;
      }
      .i-center {
        padding: 0 20px;
        text-align: center;
        i {
          font-size: 40px;
        }
      }
      .i-right {
        text-align: left;
      }
      .icon-favorite {
        color: $color-sub-theme;
      }
    }
  }
}
</style>

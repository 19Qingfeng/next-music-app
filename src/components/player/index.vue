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
      <div
        class="middle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="middle-l" v-show="true" :style="middleLStyle">
          <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img ref="cdImageRef" :class="cdCls" :src="currentSong.pic" />
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <p class="playing-lyric">{{ playingLyric }}</p>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
          <div class="lyric-wrapper">
            <div ref="lyricListRef" v-if="currentLyric">
              <p
                class="text"
                :class="{ current: currentLineNum === index }"
                v-for="(line, index) in currentLyric.lines"
                :key="line.num"
              >
                {{ line.txt }}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
          <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              ref="barRef"
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChaned"
            ></progress-bar>
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
      @ended="end"
      @canplay="canplay"
      @error="error"
      @timeupdate="timeupdate"
    ></audio>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { formatTime } from '@/assets/js/utils'
import { PLAY_MODE } from '@/assets/js/constant'
import useModel from './use-mode'
import useCd from './use-cd'
import useFavorite from './use-favorite'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import ProgressBar from './progress-bar.vue'
import Scroll from '../base/scroll/index.vue'

export default {
  name: 'Player',
  components: {
    Scroll,
    ProgressBar
  },
  setup () {
    let lock = false // 播放时拖动锁
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
    const playMode = computed(() => {
      return store.state.playMode
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
    const { cdCls, cdRef, cdImageRef } = useCd()
    const { getFavorite, toggleFavorite } = useFavorite()
    const {
      currentLyric, currentLineNum, pureMusicLyric, playingLyric, lyricScrollRef,
      lyricListRef, playLyric, stopLyric
    } = useLyric(songReady, currentTime)
    const {
      currentShow, middleLStyle, middleRStyle, onTouchStart,
      onTouchMove,
      onTouchEnd
    } = useMiddleInteractive()

    // watch
    watch(playing, (val) => {
      const audio = audioRef.value
      if (!songReady.value) {
        return
      }
      if (val) {
        audio.play()
        playLyric()
      } else {
        audio.pause()
        stopLyric()
      }
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
    const onProgressChanging = (progress) => {
      lock = true
      currentTime.value = (progress / 100) * audioRef.value.duration
      // currentTime变化后切换到对应的位置歌词 然后在暂停
      playLyric()
      stopLyric()
    }

    const onProgressChaned = (progress) => {
      lock = false
      audioRef.value.currentTime = currentTime.value =
        (progress / 100) * audioRef.value.duration
      playLyric()
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    const togglePlay = () => {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingState', !playing.value)
    }

    const timeupdate = (e) => {
      // e.timeStamp 返回系统启动至今的毫秒数
      if (lock) {
        return
      }
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
      playLyric()
    }

    const pause = () => {
      store.commit('setPlayingState', false)
    }

    const end = () => {
      // 触发ended事件的时候会提前触发一次pause 所以注意loop中的playState切换
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
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
      store.commit('setPlayingState', true)
    }
    return {
      currentTime,
      currentSong,
      fullScreen,
      audioRef,
      cdRef,
      cdImageRef,
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
      end,
      goBack,
      formatTime,
      onProgressChanging,
      onProgressChaned,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavorite,
      toggleFavorite,
      // cd
      cdCls,
      // lyric
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      currentLyric,
      currentLineNum,
      // middleInteractive
      currentShow,
      middleLStyle,
      middleRStyle,
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  }
}
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
  .middle {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
    .middle-l {
      display: inline-block;
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 80%;
      .cd-wrapper {
        position: absolute;
        left: 10%;
        top: 0;
        width: 80%;
        box-sizing: border-box;
        height: 100%;
        .cd {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 50%;
            border: 10px solid rgba(255, 255, 255, 0.1);
          }
          .playing {
            animation: rotate 20s linear infinite;
          }
        }
      }
      .playing-lyric-wrapper {
        width: 80%;
        margin: 30px auto 0 auto;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          height: 20px;
          line-height: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
    .middle-r {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .text {
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
          &.current {
            color: $color-text;
          }
        }
        .pure-music {
          padding-top: 50%;
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
    .dot-wrapper {
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        vertical-align: middle;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
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

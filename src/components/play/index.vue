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
    </div>
    <audio ref="audioRef"></audio>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Player',
  setup () {
    const store = useStore()
    const audioRef = ref(null)
    const currentSong = computed(() => {
      return store.getters.currentSong
    })
    const fullScreen = computed(() => {
      return store.state.fullScreen
    })

    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const audio = audioRef.value
      audio.src = newSong.url
      audio.play()
    })

    const goBack = () => {
      store.commit('setFullScreen', false)
    }
    return {
      currentSong,
      fullScreen,
      audioRef,
      goBack
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
}
</style>

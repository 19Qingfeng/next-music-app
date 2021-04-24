<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      :style="srollStyle"
      v-loading:[loadingText]="loading"
      v-empty:[emptyText]="isEmpty"
      :probeType="3"
      @onScroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from '../base/scroll'
import SongList from '../base/song-list'

const RESERVED_HEIGHT = 40
export default {
  props: {
    songs: {
      type: Array
    },
    title: {
      type: String
    },
    pic: {
      type: String
    },
    loading: {
      type: Boolean
    },
    emptyText: {
      type: String,
      default: '这里什么都没有'
    }
  },
  data: function () {
    return {
      imageHeight: null,
      loadingText: '歌曲加载中',
      scrollY: null,
      maxTranslateY: 0
    }
  },
  components: {
    Scroll,
    SongList
  },
  computed: {
    isEmpty () {
      return !this.loading && this.songs && this.songs.length === 0
    },
    bgStyle () {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = RESERVED_HEIGHT + 'px'
        translateZ = 1 // 解决移动端IOS兼容Zindex问题
      }

      let scale = 1
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      return {
        'background-image': `url(${this.pic})`,
        'z-index': zIndex,
        paddingTop,
        height,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    srollStyle () {
      return {
        top: this.imageHeight + 'px'
      }
    },
    filterStyle () {
      let filter = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      if (scrollY > 0) {
        filter = Math.min(scrollY / this.imageHeight, this.maxTranslateY / imageHeight) * 20
      }
      return {
        'backdrop-filter': `blur(${filter}px)`
      }
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    onScroll ({ y }) {
      this.scrollY = -y
    }
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  }
}
</script>
<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    // padding-top: 70%;
    // height: 0;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>

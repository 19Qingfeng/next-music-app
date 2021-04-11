<template>
  <div class="recommend">
    <scroll class="recommend-scroll">
      <div>
        <div class="slide-wrapper">
          <div class="slide-content">
            <slide v-if="sliders.length" :sliders="sliders" />
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in albums" :key="item.id" class="item">
              <div class="icon">
                <img width='60' height="60" v-lazy="item.pic" >
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Slide from '../components/base/slide/index.vue'
import Scroll from '../components/base/scroll/index.vue'
import { getRecommend } from '@/service/recommend'
export default {
  name: 'Recommend',
  components: {
    Slide,
    Scroll
  },
  data () {
    return {
      sliders: [],
      albums: []
    }
  },
  async created () {
    const data = await getRecommend()
    this.sliders = data.sliders
    this.albums = data.albums
  }
}
</script>

<style lang='scss' scoped>
.recommend {
  position: fixed;
  top: 88px;
  width: 100%;
  bottom: 0;
  .recommend-scroll {
    height: 100%;
    overflow: hidden;
    .slide-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      // 使用padding-top 保持宽高比 1:0.25
      padding-top: 40%;
      overflow: hidden;
      .slide-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>

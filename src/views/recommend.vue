<template>
  <div class="recommend">
    <div class="slide-wrapper">
      <div class="slide-content">
        <slide v-if="sliders.length" :sliders="sliders" />
      </div>
    </div>
  </div>
</template>

<script>
import Slide from '../components/base/slide/index.vue'
import { getRecommend } from '@/service/recommend'
export default {
  name: 'Recommend',
  components: {
    Slide
  },
  data () {
    return {
      sliders: []
    }
  },
  async created () {
    const data = await getRecommend()
    this.sliders = data.sliders
  }
}
</script>

<style lang='scss' scoped>
.recommend {
  position: fixed;
  top: 88px;
  width: 100%;
  bottom: 0;
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
}
</style>

<template>
  <div class="progress-bar" @click="click">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        @touchstart.prevent="touchstart"
        @touchmove.prevent="touchmove"
        @touchend.prevent="touchend"
        :style="btnStyle"
      >
        <!-- 坑死我了，注意事件冒泡。否则会超出。touchs事件.prevent会阻止点击事件，从而不会冒泡。不触发click事件 -->
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const barWidth = 16
export default {
  name: 'ProgressBar',
  emits: [
    'progress-changing',
    'progress-changed'
  ],
  props: {
    progress: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      realWidth: 0,
      progressWidth: 0
    }
  },
  computed: {
    progressStyle () {
      return {
        width: this.progressWidth + 'px'
      }
    },
    btnStyle () {
      return {
        transform: `translate3d(${this.progressWidth}px,0, 0)`
      }
    }
  },
  watch: {
    progress (n) {
      this.computedProcess()
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    computedProcess () {
      this.realWidth = this.$el.clientWidth - barWidth
      this.progressWidth = this.realWidth * (this.progress / 100)
    },
    touchstart (e) {
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    touchmove (e) {
      const delta = e.touches[0].pageX - this.touch.x1
      const usedWidth = this.touch.beginWidth + delta
      const progressWidth = this.$el.clientWidth - barWidth
      this.progressWidth = Math.max(0, Math.min(usedWidth, progressWidth))
      const progress = this.progressWidth / progressWidth * 100
      this.$emit('progress-changing', progress)
    },
    touchend () {
      const usedWidth = this.$refs.progress.clientWidth
      const progressWidth = this.$el.clientWidth - barWidth
      const progress = usedWidth / progressWidth * 100
      this.$emit('progress-changed', progress)
    },
    click (e) {
      console.log('点击')
      const pageX = e.pageX
      const left = this.$el.getBoundingClientRect().left
      const width = pageX - left
      const progressWidth = this.$el.clientWidth - barWidth
      this.progressWidth = Math.max(0, Math.min(width, progressWidth))
      const progress = this.progressWidth / progressWidth * 100
      this.$emit('progress-changed', progress)
    }
  }
}
</script>

<style lang='scss' scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>

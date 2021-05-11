<template>
  <div class="progress-bar">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div class="progress-btn-wrapper" :style="btnStyle">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const barWidth = 16
export default {
  name: 'ProgressBar',
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
  methods: {
    computedProcess () {
      this.realWidth = this.$el.clientWidth - barWidth
      this.progressWidth = this.realWidth * (this.progress / 100)
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

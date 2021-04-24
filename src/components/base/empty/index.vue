<template>
  <div class="empty">
    <div class="empty-wrapper">
      <div class="banner-image"></div>
      <p class="text">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  data () {
    return {
      title: 'empty'
    }
  },
  methods: {
    setTitle (title) {
      this.title = title
    }
  }
}
</script>

<style lang='scss' scoped>
.empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3D(-50%, -50%, 0);
  .empty-wrapper {
    width: 100%;
    text-align: center;
    .banner-image {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      background-size: 86px 90px;
      @include bg-image("./no-result");
    }
    .text {
      margin-top: 30px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
}
</style>

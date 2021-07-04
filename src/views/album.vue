<template>
  <div class="recomment-detail">
    <music-list :songs="songs" :pic="pic" :title="name" :loading="loading" />
  </div>
</template>
<script>
import createDetailComponent from '@/assets/js/create-detail-component'
import { getAlbum } from '../service/recommend/index'
import { ALBUM_SESSION } from '@/assets/js/constant'

export default createDetailComponent('recommend-detail', ALBUM_SESSION, getAlbum)
</script>
<style lang="scss" scoped>
.recomment-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background;
  .bg-img {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
  }
}
</style>

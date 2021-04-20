<template>
  <div class="singer-detail">
    {{singer}}
  </div>
</template>

<script>
import { getSingerDetail } from '../service/singer'
export default {
  name: 'sing-detail',
  props: {
    singer: {
      type: Object
    }
  },
  async created () {
    const result = await getSingerDetail(this.singer)
    console.log(result)
  }
}

</script>
<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background;
}
</style>

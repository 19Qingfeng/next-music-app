<template>
  <scroll
    ref="scrollWrapper"
    class="index-list"
    :probeType="3"
    @onScroll="onScroll"
  >
    <ul ref="rootRef">
      <li v-for="group in data" :key="group.title" class="group">
        <h2 class="title">
          {{ group.title }}
        </h2>
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="item"
            @click="onItemClick(item)"
          >
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle">
      <div class="fixed-title" :style="transformStyle">{{ fixedTitle }}</div>
    </div>
    <div
      class="shortcut"
      @touchstart.prevent.stop="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.prevent.stop
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortTitle"
          :key="item"
          :class="{ current: currentIndex === index }"
          :data-index="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../base/scroll/index.vue'
import useFixed from './use-fixed'
import useShortcur from './use-shortcut'
import { ref } from 'vue'
export default {
  name: 'IndexList',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  emits: ['selected'],
  setup (props, { emit }) {
    const scrollWrapper = ref(null)
    const { rootRef, fixedTitle, currentIndex, onScroll, transformStyle } = useFixed(props)
    const { shortTitle, onTouchStart, onTouchMove } = useShortcur(props, scrollWrapper, rootRef)
    const onItemClick = (item) => {
      emit('selected', item)
    }
    return {
      rootRef,
      fixedTitle,
      shortTitle,
      currentIndex,
      onScroll,
      onTouchStart,
      onTouchMove,
      onItemClick,
      transformStyle,
      scrollWrapper
    }
  }
}
</script>
<style lang="scss" scoped>
.index-list {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>

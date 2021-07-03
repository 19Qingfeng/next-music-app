import Scroll from '../base/scroll/index.vue'
import {
  ref,
  computed,
  watch,
  h,
  mergeProps,
  withCtx,
  renderSlot,
  nextTick
} from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'wrapper-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps(
        {
          ref: 'scrollRef'
        },
        ctx.$props,
        {
          onOnScroll: e => {
            ctx.$emit('onScroll', e)
          }
        }
      ),
      {
        default: withCtx(() => [renderSlot(ctx.$slots, 'default')])
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const store = useStore()

    const playList = computed(() => store.state.playList)
    const bs = computed(() => scrollRef.value.bs)
    const refreshScroll = computed(() => scrollRef.value.refreshScroll)

    watch(playList, async () => {
      await nextTick()
      bs.value.refresh()
    })

    return {
      scrollRef,
      refreshScroll,
      bs
    }
  }
}

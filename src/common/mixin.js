import { debounce } from './utils'

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted() {
    let refresh = debounce (this.$refs.scroll.refresh, 100)
    this.itemItemListener = () => {
      refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemItemListener)
  }
}
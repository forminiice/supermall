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

import BackTop from "components/content/backTop/BackTop";
import {BACK_POSITION} from 'common/const'

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    listenShowBackTop(position) {
      this.isShowBackTop = -position.y > BACK_POSITION;
    }
  },
  components: {
    BackTop
  }
}
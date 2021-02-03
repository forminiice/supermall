<template>
  <div class="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        ref="params"
        :param-info="paramInfo"
      ></detail-param-info>
      <detail-comment-info
        ref="comment"
        :comment-info="commentInfo"
      ></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <toast :message="toastMessage" :toastShow="toastShow"></toast>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import Toast from 'components/common/toast/Toast'


import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
import { itemListenerMixin, backTopMixin } from 'common/mixin'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    Toast
  },
  mixins: [
    itemListenerMixin,
    backTopMixin
  ],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: null,
      toastMessage: '',
      toastShow: false
    }
  },
  created() {
    // 1. 保存传入的iid
    this.iid = this.$route.params.iid;

    // 2. 根据iid请求数据
    getDetail(this.iid).then(res => {
      const data = res.result;
      // 1. 获取顶部轮播数据
      this.topImages = data.itemInfo.topImages
      // 2. 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 3. 创建店铺信息
      this.shop = new Shop(data.shopInfo)
      // 4. 保存商品的详情数据
      this.detailInfo = data.detailInfo
      // 5. 获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 6. 取出商品评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    })

    // 3. 请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
  },
  mounted() {
  },
  updated() {
  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemItemListener)
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
      
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // console.log(this.themeTopYs);
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll(position) {
      // 1. 获取y值
      const positionY = -position.y;
      // 2. positionY和主题中值进行对比
      let length = this.themeTopYs.length
      for (let i = 0; i < length; i++) {
        if (i !== this.currentIndex && ((i < length - 1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY > this.themeTopYs[i]))) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // 判断BackTop是否显示
      this.listenShowBackTop(position);
    },
    addToCart() {
      // 1. 获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid =  this.iid;

      // 2. 将商品添加到购物车
      this.$store.dispatch('addCart', product).then(res => {
        // this.toastMessage = res
        // this.toastShow = true

        // setTimeout(() => {
        //   this.toastShow = false
        //   this.toastMessage = ''
        // }, 1500)
        this.$toast.show(res, 1500)
        console.log(this.$toast);
      })
      // console.log(this.$store.state.cartList);
    }
  }
}
</script>

<style scoped>
.detail {
  overflow: hidden;
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  overflow: hidden;
  height: calc(100% - 44px - 58px);
}
</style>
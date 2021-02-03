<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" 
        :is-checked="isSelectAll" 
        @click.native="checkClick"
      ></check-button>
      <span>全选</span>
    </div>

    <div class="total-price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'
import { mapGetters } from 'vuex'

export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.$store.state.cartList
        .filter(item => item.checked)
        .reduce((preValue, item) => {
          return item.price * item.count + preValue
        }, 0)
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if(this.cartList.length === 0)
        return false;
      else
        // return !(this.cartList.filter(item => !item.checked).length)
        return !this.cartList.find(item => !item.checked);
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach(item => item.checked = false)
      } else {
        this.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick() {
      if (!this.isSelectAll) {
        
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  display: flex;
  height: 40px;
  background-color: #eee;
  position: relative;
  font-size: 14px;
  line-height: 40px;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}

.total-price {
  margin-left: 20px;  
  flex: 1;
}

.calculate {
  text-align: center;
  width: 90px;
  color: #fff;
  background-color: red;
}
</style>
<template>
 <div class="cart">
   <nav-bar class="nav-bar">
<!--    导航-->
     <div slot="center">购物车({{length}})</div>
   </nav-bar>
   <!--     商品列表-->
   <cart-list/>
<!--   底部汇总-->
   <cart-bottom-bar />
 </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";
  import {mapGetters} from 'vuex'
  export default {
    name: "Cart",
    components:{
      NavBar,
      CartList,
      CartBottomBar
    },
    computed:{
      //第一种
      // cartLength(){
      // return this.$store.getters.cartLength
      // }
    //  第二种:数组方法
    //   ...mapGetters(['cartLength'])
    //  第三种：对象方法
      ...mapGetters({
        length:'cartLength'
      })
    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;
  }
  .nav-bar{
    background-color:var(--color-tint);
    color:#fff;
    font-weight: 700;
  }
</style>

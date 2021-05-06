<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    ref="nav"
                    @titleClick="titleClick"/>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo"
                         @imageLoad="detailImageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backTop"
              v-show="isShowBackTop"/>
  </div>
</template>

<script>
    import DetailNavBar from "./childComps/DetailNavBar";
    import DetailSwiper from "./childComps/DetailSwiper";
    import DetailBaseInfo from "./childComps/DetailBaseInfo";
    import DetailShopInfo from "./childComps/DetailShopInfo";
    import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
    import DetailParamInfo from "./childComps/DetailParamInfo";
    import DetailCommentInfo from "./childComps/DetailCommentInfo";
    import DetailBottomBar from "./childComps/DetailBottomBar";

    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
    import {itemListenerMixin,backTopMixin} from "common/mixin";
    import {debounce} from "common/utils";
    import {mapActions} from 'vuex'

    import Scroll from "components/common/scroll/Scroll";
    import GoodsList from "components/content/goods/GoodsList";

    export default {
      name: "Detail",
      components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,

        Scroll
      },
      mixins:[itemListenerMixin,backTopMixin],
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
          themeTopYs:[],
          getThemeTopY:null,
          currentIndex:0,

        }
      },
      created() {
        //1.保存传入的iid
        this.iid = this.$route.params.iid
        //1.请求数据
        getDetail(this.iid).then(res => {
          //2.1.获取iid顶部的轮播图数据
          // console.log(res)
          const data = res.result
          this.topImages = data.itemInfo.topImages
          //2.2.获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
          //  2.3.创建店铺信息对象
          this.shop = new Shop(data.shopInfo)
          //2.4.保存商品的详细数据
          this.detailInfo = data.detailInfo
          // 2.5.获取参数的信息
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
          //2.6.取出评论信息
          if (data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0]
          }
        //  4.给getThemeTopY 赋值
            this.getThemeTopY = debounce(()=>{
              this.$refs.scroll.refresh()
              this.themeTopYs=[];
              this.themeTopYs.push(0)
              this.themeTopYs.push(this.$refs.params.$el.offsetTop)
              this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
              this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
              this.themeTopYs.push(Number.MAX_VALUE)

              // console.log(this.themeTopYs)
            },100)
        })
        //  2.请求推荐数据
        getRecommend().then(res => {
          // console.log(res)
          this.recommends = res.data.list
        })

      },
      methods: {
        ...mapActions(['addCart']),
        detailImageLoad() {
          // console.log('---');
          this.getThemeTopY()
        },
        titleClick(index){
          this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
        },
        contentScroll(position){
         const positionY = -position.y
          let length = this.themeTopYs.length
          for(let i = 0;i<length;i++){
            if(this.currentIndex !== i &&(positionY>=this.themeTopYs[i]
              && positionY<this.themeTopYs[i+1])){
              this.currentIndex = i
              this.$refs.nav.currentIndex = this.currentIndex
            }
          }
          //  判断是否回到顶部
          this.listenShowBackTop(position)
        },
        addToCart(){
          //获取购物车需要展示的基本信息
          let product = {}
          product.image = this.topImages[0];
          product.title = this.goods.title;
          product.desc = this.goods.desc;
          product.price = this.goods.realPrice;
          product.iid = this.iid;

        //  2.将商品添加到购物车
        //  dispatch返回一个Promise
        //   this.$store.commit('addCart',product)
        //   this.$store.dispatch('addCart',product).then(res=>{
        //     console.log(res)
        //   })
        //映射方法调用actions中方法
          this.addCart(product).then(res=>{
            // this.message = res
            // this.show = true
            //
            // setTimeout(()=>{
            //   this.show = false
            //   this.message = ''
            // },2000)
             console.log(this.$toast)
             this.$toast.show(res)
            // console.log(res)
          })
        }
      },

       destroyed() {
       this.$bus.$off('itemImageLoad',this.itemImgListener)
       }
    }
</script>

<style scoped>
#detail{
  position: relative;
  left: 0;
  top: 0;
  z-index:1;
  height: 100vh;
  background-color: #fff;

}
  .content{
    height: calc(100% - 44px);
    overflow: hidden;
  }
  .detail-nav{
    position: relative;
    z-index: 2;
    background-color: #fff;
  }
</style>

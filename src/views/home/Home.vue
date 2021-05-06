<template>
  <div id="home">
    <nav-bar class="home-nav">
    <div slot="center">购物街</div>
  </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 class="tab-control1"
                 ref="tabControl1"
                 v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">

      <home-swiper :banners="banners"
                   class="swiper"
                   @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends" />
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import{itemListenerMixin,backTopMixin} from "common/mixin";
  import {FIXED_POSITON} from "common/const";

  import Scroll from "components/common/scroll/Scroll";
  export default {
    name: "Home",
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,

      Scroll
    },
    mixins:[itemListenerMixin,backTopMixin],
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        currentType:'pop',

        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0,

      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()
      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },

    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
       // console.log('home deactivated');
      this.saveY = this.$refs.scroll.getScrollY()
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    methods:{

      /*事件监听的相关方法*/
      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        //让两个tabControl的currentIndex保持一致
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position){
        this.isTabFixed = -position.y>FIXED_POSITON
        this.listenShowBackTop(position)

      },
      loadMore(){
        // console.log('上拉加载');
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        this.tabOffsetTop =this.$refs.tabControl2.$el.offsetTop
      },
    //  网络请求相关方法
    //  请求多条数据
      getHomeMultidata(){
      getHomeMultidata().then(res=>{
        // console.log(res)
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list
      })
    },
      //2.请求商品数据
      getHomeGoods(type){
        const page = this.goods[type].page+1
        getHomeGoods(type,page).then(res=>{
          // console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1

          this.$refs.scroll.finishPullUp()
          this.$refs.scroll.refresh()


        })
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    }
  }
</script>

<style scoped>
  #home{
   height: 100vh;
    position: relative;
  }
  .home-nav{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    color: #fff;
    background-color: var(--color-tint);
  }
  .content{
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;

    /*height: calc(100% - 44px - 49px);*/
  }
  .tab-control1{
   position: relative;
    top: 44px;
    z-index: 9;
  }

</style>

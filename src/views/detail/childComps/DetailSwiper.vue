<template>
    <swiper class="swiper">
      <swiper-item v-for="item in topImages">
        <img :src="item" alt="">
      </swiper-item>
    </swiper>
</template>

<script>
  import {Swiper,SwiperItem} from "components/common/swiper";
  // import Swiper from "components/common/swiper/Swiper";
  // import SwiperItem from "components/common/swiper/SwiperItem";
  export default {
    name: "DetailSwiper",
    components:{
      SwiperItem,
      Swiper
    },
    props:{
      topImages:{
        type:Array,
        default(){
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .swiper{
    height: 300px;
    overflow: hidden;
  }
</style>

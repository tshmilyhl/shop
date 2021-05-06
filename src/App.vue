<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view />
    </keep-alive>
      <main-tab-bar/>
  </div>
</template>

<script>
import MainTabBar from "./components/content/mainTabbar/MainTabBar";
/*import Swiper from "./components/common/swiper/Swiper";
import SwiperItem from "./components/common/swiper/SwiperItem";*/

import {Swiper,SwiperItem} from "./components/common/swiper";
export default {
  name: 'App',
  components: {
    MainTabBar,
    Swiper,
    SwiperItem

  }
}
</script>

<style>
  @import "assets/css/base.css";

</style>

import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import toast from './components/common/toast'

import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

//使用toast，会在index文件中安装
Vue.use(toast)
//解决移动端300ms延迟
FastClick.attach(document.body)
//使用图片懒加载
Vue.use(VueLazyload,{
   loading:require('assets/img/common/placeholder.png')

})
new Vue({
  render: function (h) { return h(App) },
  router,
  store
}).$mount('#app')

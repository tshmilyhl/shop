import {debounce} from "./utils";
import {BACK_POSITION} from "./const";
import BackTop from "components/content/backTop/BackTop";
export const itemListenerMixin = {
  data(){
   return{
     itemImgListener:null
   }
  },
  mounted() {
    let refresh = debounce(this.$refs.scroll.refresh,100)
    this.itemImgListener = ()=>{
      refresh()
    }

    this.$bus.$on('itemImageLoad',this.itemImgListener)
  },
}

export const backTopMixin = {
  data(){
    return {
      isShowBackTop:false,
    }
  },
  components:{
    BackTop
  },
  methods:{
    backTop(){
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    listenShowBackTop(position){
      this.isShowBackTop = -position.y >BACK_POSITION
    }
  }
}

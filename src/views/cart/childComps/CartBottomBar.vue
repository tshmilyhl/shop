<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计:{{totalPrice}}
    </div>
    <div class="calculate">
      去计算:({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex';
  export default {
    name: "CartBottomBar",
    components:{
      CheckButton
    },
    computed:{
      ...mapGetters(['cartList']),
      totalPrice(){
        return '￥' +this.cartList.filter(item=>{
          return item.checked
        }).reduce((preValue,item)=>{
          return preValue +item.price*item.count
        },0).toFixed(2)
      },
      checkLength(){
        return this.cartList.filter(item=>item.checked).length

      },
      isSelectAll(){
        //1.使用filter
        // return !this.cartList.filter(item=>!item.checked).length
        if(this.cartList.length === 0) return false
        //2.使用find
        // return !this.cartList.find(item=>!item.checked)
      //  3.普通方法
       for(let item of this.cartList){
         if(!item.checked){
           return false
         }
       }
       return true
      }
    },
    methods:{
      checkClick(){
        if(this.isSelectAll){//全部选中
          this.cartList.forEach(item=>item.checked=false)
        } else{ //全部不选中或部分选中
          this.cartList.forEach(item=>item.checked=true)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar{
    display: flex;
    position: relative;
    bottom: 49px;
    height: 40px;
    line-height: 40px;

    background-color: #eee;

  }
  .check-content{
    display: flex;
    align-items: center;
    width: 60px;
    margin-left: 10px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price{
    flex: 1;
    margin-left: 30px;
  }
  .calculate{
    width: 90px;
    color: #ffffff;
    background-color:red;
    text-align: center;
  }
</style>

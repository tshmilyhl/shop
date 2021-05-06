import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutations";
import actions from './actions'
import getters from "./getters";

Vue.use(Vuex)
const state = {
  cartList:[]
}
const store = new Vuex.Store({

  //mutations唯一目的是修改state中的状态
  //mutations 中的每个方法尽可能完成的事件单一一点
  state,
  mutations,
  actions,
  getters
})
export default store



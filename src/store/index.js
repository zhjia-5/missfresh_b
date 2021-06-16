import Vue from 'vue';
import Vuex from 'vuex';
import userInfo from './userInfo';

Vue.use(Vuex)

const store =  new Vuex.Store({
  modules:{
    userInfo,
  },
  strict:true,//严格模式，非 mutation 函数引起的状态变更，将会抛出错误。
});

export default store;

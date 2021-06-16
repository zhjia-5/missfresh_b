import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/ant-design-vue';
import './styles/global.less';//导入全局样式

if(localStorage.getItem('user') && localStorage.getItem('appkey')){
  store.dispatch('userInfo/whoAmI');// 重新刷新页面或者首次加载登录
}
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

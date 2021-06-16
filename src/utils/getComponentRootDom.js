import Vue from 'vue';

//获取某个组件渲染后的Dom真实元素——用于让alertMessage在父容器居中
export default function(component,props){
  const vm = new Vue({
    render:(h)=> h(component,{props})
  });
  vm.$mount();
  return vm.$el;
}
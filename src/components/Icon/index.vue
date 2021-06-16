<template>
    <i class="iconfont icon-container" :class="fontClass"></i> 
</template>
<script>
// 使用关键字映射具体图标类名
const classMap = { 
  home: "icon-zhuye",
  success: "icon-zhengque-",
  fail: "icon-cuowu",
  close: "icon-guanbi",
  warn: "icon-jinggao",
  info: "icon-fl-xinxi",
  blog: "icon-blog",
  code: "icon-code",
  about: "icon-set_about_hov",
  weixin: "icon-weixin",
  email: "icon-emailFilled",
  github: "icon-github",
  qq: "icon-qq",
  arrowUp: "icon-ico_back",
  arrowDown: "icon-xiajiantou",
  empty: "icon-empty",
  chat: "icon-liuyan",
};
export const types = Object.keys(classMap);//导出给test.vue使用
export default {
  props:{
    type:{
      type:String,
      required:true,
    }
  },
  computed:{
    fontClass(){
      return classMap[this.type];//this.type：是指<Icon type="home"/>中的"home"
    }
  },
}
</script>
<style scoped>
  @import "//at.alicdn.com/t/font_2518878_cao3y9m4w8.css";
  .iconfont{
    color: inherit;
    font-size: inherit;
  }
</style>>



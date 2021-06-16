<template>
  <img class="loading-container" :src="loadingSrc" alt="数据加载中..." title="数据加载中..." >
</template>
<script>

import loadingSrc from "./loading.svg";
export default {
  data(){
    return {
      loadingSrc,
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/mixin.less";
// 该组件需要父元素开启position定位
  .loading-container{
    .self-center(absolute);
  }
</style>
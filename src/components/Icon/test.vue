<template>
<div class="test-container">
  <div class="item" v-for="type in types" :key="type">
  <Icon :type="type"/><!-- 使用v-for循环输出所有组件 -->
  <p>{{type}}</p><!-- 该组件的type -->
</div>
</div>
</template>

<script>
import Icon , {types} from "./index";
export default {
  name:"Icon-test",
  data(){
    return {
      types,
    }
  },
  components:{
    Icon,
  },
}
</script>

<style lang="less" scoped>
  .test-container{
    width:80vw;
    margin: 5vw auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .item{
    margin: 20px;
    text-align: center;
  }
  // Icon
  .icon-container{
    font-size: 3vw;
  }
</style>
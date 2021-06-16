<template>
  <div class="home-container">
    <!-- 左边菜单栏：定宽 -->
    <div class="menu-container">
      <a-menu
        :default-selected-keys="['1']"
        :default-open-keys="['sub1']"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
      >
        <a-sub-menu key="sub1">
          <span slot="title"><a-icon type="home" /><span>首页</span></span>
          <a-menu-item
            key="5"
            :class="{ 'ant-menu-item-selected': $route.name === 'Compute' }"
          >
            <!-- 首次加载添加选中背景 -->
            <RouterLink exact :to="{ name: 'Compute' }"
              ><a-icon type="database" />统计</RouterLink
            >
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="appstore" /><span>商品</span></span>
          <a-menu-item key="9"  ref='goodsList' :class="{'ant-menu-item-selected': $route.name === 'GoodsList'}">
            <RouterLink :to="{ name: 'GoodsList' }"><a-icon type="unordered-list" /> 商品列表</RouterLink >
          </a-menu-item>
          <a-menu-item key="10" ref='addGoods' :class="{'ant-menu-item-selected': $route.path === '/addgoods'}">
            <RouterLink :to="{ name: 'AddGoods' }"><a-icon type="file-add" />
            {{ $route.params.id ? "商品修改" : "商品新增" }}
          </RouterLink>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <!-- 右边区域： -->
    <div class="right-container">
      <!-- 上面吊顶 -->
      <div class="top-container">
        <a-button type="primary" @click="toggleCollapsed">
          <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
        </a-button>
        <div class="title">
          <span v-show="$route.name === 'Compute'">首页 / 统计</span>
          <span v-show="$route.name === 'GoodsList'">商品 / 商品列表</span>
          <span v-show="$route.name === 'AddGoods'">商品 / 编辑</span>
        </div>
        <div class="user" v-show="user">
          <div >
            <span>{{ user ? user.username : "" }}</span><a-icon class="icon-down" type="down" />
          </div>
          <div class="sign-out" @click="handleLogout">退出</div>
        </div>
      </div>

      <!-- 下面显示嵌套路由信息  -->
      <div class="bottom-container"><RouterView /></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("userInfo", ["user"]),
  },
  data() {
    return {
      collapsed: false,
    };
  },
  methods: {
    // 退出
    handleLogout() {
      this.$store.commit("userInfo/setUser", null);
      this.$router.push({ name: "Login" });
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@/styles/var.less";
.home-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  // 左边菜单栏
  .menu-container {
    height: 100%;
    background: @drak;
    a {
      padding-right: 30px;
    }
  }
  // 右边展示区
  .right-container {
    flex: 1 1 auto;
    overflow-y: scroll;
    // 吊顶
    .top-container {
      position: relative;
      padding: 10px;
      font-size: 16px;
      border-bottom: 1px solid lighten(@gray, 10%);
      .title {
        display: inline-block;
        padding-left: 10px;
      }
      .user {
        position: absolute;
        right: 10px;
        top: 0px;
        width: 80px;
        height: 52px;
        text-align: center;
        line-height: 52px;
        cursor: pointer;
        .icon-down {
          margin-left: 5px;
        }
        &:hover .sign-out {
          transition: all 0.5s;
          display: block;
        }
        .sign-out {
          display: none;
          cursor: pointer;
          &:hover {
            background: @gray;
            font-weight: bold;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>

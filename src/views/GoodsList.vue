<template>
  <div class="goods-list-container">
    <div class="search">
      <!-- 关键字 -->
      <span>标题关键字：</span>
      <a-input
        class="keyword"
        placeholder="请输入与标题相关"
        v-model.lazy="keyWord"
      />
      <!-- 商品类目 -->
      <span>商品类目：</span>
      <div class="category">
        <a-select
          style="width: 100%"
          v-model.number="cateValue"
          placeholder="请选择商品类目"
        >
          <a-select-option v-for="(item, i) in cateList" :key="i" :value="i">
            {{ cateList[i] }}
          </a-select-option>
        </a-select>
      </div>
      <a-button type="primary" @click="handleSearch">搜索</a-button>
      <!-- 添加商品 -->
      <a-button class="add-goods" @click="$router.push({ name: 'AddGoods' })"
        >添加商品</a-button
      >
    </div>
    <!-- 商品列表 -->
    <table class="goods-list">
      <tr>
        <th>ID</th>
        <th>标题</th>
        <th>描述</th>
        <th>类目</th>
        <th>预售价</th>
        <th>折扣价</th>
        <th>标签</th>
        <th>限购数</th>
        <th>状态</th>
        <th>操作</th>
      </tr>
      <template v-if="showList">
        <tr v-for="item in showList" :key="item.id" ref="tr">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.desc }}</td>
          <td>{{ cateList[item.category] }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.price_off }}</td>
          <td>{{ item.tags }}</td>
          <td>{{ item.inventory }}</td>
          <td>{{ item.status === 1 ? "上架" : "下架" }}</td>
          <td class="btn">
            <a-button
              ><RouterLink :to="{ name: 'EditGoods', params: { id: item.id } }"
                >编辑</RouterLink
              ></a-button
            >
            <a-button :data-id="item.id" @click="handleRemove">删除</a-button>
          </td>
        </tr>
      </template>
    </table>
    <!-- 分页组件 -->
    <div class="pagination">
      <a-pagination
        v-model="current"
        show-size-changer
        :default-current="1"
        :total="filterGoods ? filterGoods.length : 0"
      />
    </div>
  </div>
</template>
<script>
import { getGoods, removeGoods } from "@/api/goods";
export default {
  data() {
    return {
      pageSize: 10,
      current: 1, //分页当前值
      keyWord: "",
      cateValue: 0, //分类的数
      goodsList: [], //存储所有的数据
      filterGoods: [], //存储过滤后的商品数组
      cateList: [
        "全部",
        "酒水冲调",
        "时令水果",
        "安心乳品",
        "休闲零食",
        "新鲜蔬菜",
      ],
    };
  },
  computed: {
    // 总页数
    pageNum() {
      return Math.ceil(this.filterGoods.length / this.pageSize);
    },
    // 根据点击分页返回一个显示商品列表，默认显示第一页商品
    showList() {
      if (!this.filterGoods.length) return;
      const arr = [];
      for (
        let i = (this.current - 1) * this.pageSize;
        i < this.current * this.pageSize;
        i++
      ) {
        if (this.filterGoods[i]) {
          arr.push(this.filterGoods[i]);
        }
      }
      return arr;
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 搜索
    handleSearch() {
      if (!this.goodsList.length) return;
      if (this.cateValue > 0) {
        const arr = this.goodsList.filter((item) => {
          return item.category === this.cateValue;
        });
        // 有分类  无关键字
        if (!this.keyWord.length) {
          this.filterGoods = arr;
          return;
        } else {
          // 有分类  有关键字
          this.filterGoods = arr.filter((item) => {
            return item.title.includes(this.keyWord);
          });
        }
      } else {
        // 全部分类：有关键字
        if (this.keyWord.length) {
          this.filterGoods = this.goodsList.filter((item) => {
            if (!item.title) return;
            return item.title.includes(this.keyWord);
          });
        } else {
          // 全部分类：无关键字 --> 表示返回全部商品
          this.filterGoods = this.goodsList;
        }
      }
    },
    //删除
    async handleRemove(e) {
      const id = e.target.dataset.id;
      if (confirm(`是否删除id为${id}的商品?`)) {
        const resp = await removeGoods(id);
        if (resp.data.status === "success") {
          this.fetchData(); //删除陈功重新请求数据
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      }
    },
    async fetchData() {
      const resp = await getGoods();
      if (resp.data.status === "success") {
        const { data } = resp.data.data;
        this.goodsList = data ? data : [];
        this.filterGoods = this.goodsList; // 默认加载所有数据
      }
    },
  },
  watch: {
    // 当current放生改变调用showList
    current() {
      this.showList;
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@/styles/var.less";
.goods-list-container {
  .search {
    overflow: hidden;
    font-size: 16px;
    padding: 15px;
    .keyword {
      display: inline-block;
      width: 12vw;
      margin-right: 20px;
    }
    .category {
      display: inline-block;
      width: 12vw;
      margin-right: 10px;
    }
    .add-goods {
      float: right;
      margin-right: 80px;
    }
  }
  .goods-list {
    width: 100%;
    padding: 10px;
    tr:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    th {
      height: 50px;
      text-align: center;
      background: rgba(0, 0, 0, 0.05);
    }
    td {
      height: 80px;
      text-align: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      &.btn {
        display: flex;
        align-items: center;
      }
    }
  }
  .pagination {
    margin: 50px 0;
    text-align: center;
  }
}
</style>
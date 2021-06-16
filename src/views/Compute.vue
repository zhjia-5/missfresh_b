<template>
  <div class="compute-container">
          <!-- 卡片区域 -->
      <div class="card-container">
        <div style="background-color: #ececec; padding: 20px">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-card title="商品总览" :bordered="false">
                <p>card content</p>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card title="用户总览" :bordered="false">
                <p>card content</p>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card title="商品总览" :bordered="false">
                <p>card content</p>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    <div class="echarts" ref="echarts"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      option: {
        title: {
          text: "堆叠区域图",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["访问用户", "下单用户", "下单率"],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "访问用户",
            type: "line",
            stack: "总量",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [1348, 2909, 908, 2008, 768, 578, 1090],
          },
          {
            name: "下单用户",
            type: "line",
            stack: "总量",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [100, 500, 59, 600, 90, 340, 700],
          },
          {
            name: "下单率",
            type: "line",
            stack: "总量",
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: ["13%", "17%", "5%", "29%", "17%", "58%", "64%%"],
          },
        ],
      },
    };
  },

  mounted() {
    const myChart = echarts.init(this.$refs.echarts);
    this.option && myChart.setOption(this.option);
  },
};
</script>
<style lang='less' scoped>
.compute-container {
  width: 100%;
  height: 300px;
  .echarts {
    width: 100%;
    height: 300px;
  }
  .card-container{
    display: block;
    width: 100%;
  }
}
</style>


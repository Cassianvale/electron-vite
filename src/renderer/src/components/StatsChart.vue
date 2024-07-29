<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>系统性能监控</span>
      </div>
      <div>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-card>
              <h3>内存占用率</h3>
              <div ref="memoryChartRef" class="v-chart"></div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <h3>CPU 占用率</h3>
              <div ref="cpuChartRef" class="v-chart"></div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <h3>GPU 占用率</h3>
              <div ref="gpuChartRef" class="v-chart"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { ElCard, ElRow, ElCol } from 'element-plus';

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
]);

const memoryOptions = ref({
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ['已用', '总量']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [0, 0], // 初始数据，后续替换为动态数据
    type: 'bar'
  }]
});

const cpuOptions = ref({
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ['利用率 (%)']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [0, 0], // 初始数据，后续替换为动态数据
    type: 'bar'
  }]
});

const gpuOptions = ref({
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ['利用率 (%)', '已用显存 (GB)', '总显存 (GB)']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [0, 0, 0], // 初始数据，后续替换为动态数据
    type: 'bar'
  }]
});

const memoryChartRef = ref(null);
const cpuChartRef = ref(null);
const gpuChartRef = ref(null);

let memoryChart, cpuChart, gpuChart;

const updateChartData = (data) => {
  const { memoryData, cpuData, gpuData } = data;

  const memoryUsed = (memoryData.used / (1024 ** 3)).toFixed(2);
  const memoryTotal = (memoryData.total / (1024 ** 3)).toFixed(2);
  const cpuLoad = cpuData.currentLoad.toFixed(2);
  // const cpuSpeed = (cpuData.cpus[0].speed / 1000).toFixed(2);
  // const gpuUtilization = gpuData.controllers[0].utilizationGpu.toFixed(2);
  // const gpuMemoryUsed = (gpuData.controllers[0].memoryUsed / 1024).toFixed(2);
  // const gpuMemoryTotal = (gpuData.controllers[0].memoryTotal / 1024).toFixed(2);

  let gpuUtilization = 0;
  let gpuMemoryUsed = 0;
  let gpuMemoryTotal = 0;

  // 确认第三个 GPU 控制器存在并且有我们需要的数据
  if (gpuData.controllers && gpuData.controllers[2]) {
    const gpuController = gpuData.controllers[2];
    gpuUtilization = gpuController.utilizationGpu ? gpuController.utilizationGpu.toFixed(2) : 0;
    gpuMemoryUsed = gpuController.memoryUsed ? (gpuController.memoryUsed / 1024).toFixed(2) : 0;
    gpuMemoryTotal = gpuController.memoryTotal ? (gpuController.memoryTotal / 1024).toFixed(2) : 0;
  }


  memoryChart.setOption({
    series: [{
      data: [memoryUsed, memoryTotal]
    }]
  });

  cpuChart.setOption({
    series: [{
      data: [cpuLoad]
    }]
  });

  gpuChart.setOption({
    xAxis: {
      data: ['利用率 (%)', '已用显存 (GB)', '总显存 (GB)']
    },
    series: [{
      data: [gpuUtilization, gpuMemoryUsed, gpuMemoryTotal]
    }]
  });
};

onMounted(async () => {
  await nextTick();
  memoryChart = echarts.init(memoryChartRef.value);
  cpuChart = echarts.init(cpuChartRef.value);
  gpuChart = echarts.init(gpuChartRef.value);

  memoryChart.setOption(memoryOptions.value);
  cpuChart.setOption(cpuOptions.value);
  gpuChart.setOption(gpuOptions.value);

  const data = await window.api.getSystemData();
  console.log("Initial data:", data);  // 添加这一行
  updateChartData(data);

  window.electron.ipcRenderer.on('system-data', (_, data) => {
    console.log("Updated data:", data);  // 添加这一行
    updateChartData(data);
  });

  setInterval(async () => {
    const data = await window.api.getSystemData();
    console.log("Interval data:", data);  // 添加这一行
    updateChartData(data);
  }, 5000);

  const resizeCharts = () => {
    memoryChart.resize();
    cpuChart.resize();
    gpuChart.resize();
  };

  window.addEventListener('resize', resizeCharts);
});
</script>

<style scoped>
.clearfix{
  margin-bottom: 20px;
}
.box-card {
  margin: 5px 10px 10px;
  padding-bottom: 105px;
}

.el-card {
  text-align: center;
}

.v-chart {

  height: 300px; /* 确保高度非零 */
}
</style>

<template>
  <div class="homepage">
    <p>{{ windowTitle }}</p>
    <p>{{ message }}</p>
    <button @click="incrementCounter">点击我</button>
    <p>计数器: {{ counter }}</p>
    <p class="mt-10"><el-button type="default" size="small" @click="createNewsWindow">News窗口</el-button></p>
    <p class="mt-10"><el-button type="default" size="small" @click="goToStatsChart">StatsChart窗口</el-button></p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const message = ref('这是一个使用 Vue 3 和 Composition API 创建的简单示例页面。')
const counter = ref(0)
const windowTitle = ref('欢迎来到我的首页')


const incrementCounter = () => {
  counter.value++
}

// News窗口
const createNewsWindow = () => {
  window.api.createGenericWindow('/news', 400, 300);
}

// statschart窗口
const goToStatsChart = () => {
  window.api.createGenericWindow('/statschart', 1500, 600);
};

const updateTitle = () => {
  // emoji葡萄
  const logo = '🍇';
  if (logo) {
    window.api.updateWindowTitle('主页', logo);
  } else {
    window.api.updateWindowTitle('主页');
  }
};


onMounted(() => {
  updateTitle();

})
</script>

<style scoped>
html, body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.homepage {
  height: 100vh;
  text-align: center;
  background-color: aquamarine;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}


</style>

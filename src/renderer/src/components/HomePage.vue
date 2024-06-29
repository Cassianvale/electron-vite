<template>
  <div class="homepage">
    <p>{{ message }}</p>
    <button @click="incrementCounter">点击我</button>
    <p>计数器: {{ counter }}</p>
    <p class="mt-10"><el-button type="default" size="small" @click="createNewsWindow">News窗口</el-button></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const message = ref('这是一个使用 Vue 3 和 Composition API 创建的简单示例页面。')
const counter = ref(0)
const windowTitle = ref('欢迎来到我的首页')


const incrementCounter = () => {
  counter.value++
}

// 点击News窗口按钮创建 News 窗口
const createNewsWindow = () => {
  window.electron.ipcRenderer.invoke('create-generic-window', {
    url: '/news',
    width: 400,
    height: 300,
    parent: 'home'
  });
}

onMounted(() => {
  window.electron.ipcRenderer.on('window-title-update', (event, newTitle) => {
    console.log('Received window-title-update in Home.vue with title:', newTitle)
    windowTitle.value = newTitle
  })

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

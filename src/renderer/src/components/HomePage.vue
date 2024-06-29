<template>
  <div class="homepage">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <button @click="incrementCounter">点击我</button>
    <p>计数器: {{ counter }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定义标题和消息的状态
const title = ref('欢迎来到我的首页')
const message = ref('这是一个使用 Vue 3 和 Composition API 创建的简单示例页面。')

// 定义计数器的状态
const counter = ref(0)

// 定义一个函数来增加计数器
const incrementCounter = () => {
  counter.value++
}

</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
.homepage {
  text-align: center;
  background-color: aquamarine;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}


</style>

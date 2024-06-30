<template>
    <div class="news">
      <title>News</title>
      <h1>News Window</h1>
      <p>This is the news window content.</p>
      <el-input v-model="inputValue" placeholder="测试"></el-input>
    </div>
</template>



<script setup lang="ts">
import { ref } from 'vue'
const inputValue = ref('')



</script>

<style lang="scss" scoped>
.news {
  padding: 20px;
}
</style>

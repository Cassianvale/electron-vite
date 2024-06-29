<template>
  <div id="app" >
    <TitleBar />
    <router-view />
  </div>
</template>

<script setup lang="ts">

import TitleBar from './components/TitleBar.vue'

</script>


<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

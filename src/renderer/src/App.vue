<template>
  <div id="app">
    <ShopSelector />
    <StatusUpdater />
    <PresetOptions />
  </div>
  <Versions />
</template>

<script setup lang="ts">
import Versions from './components/Versions.vue'
import ShopSelector from './components/ShopSelector.vue'
import StatusUpdater from './components/StatusUpdater.vue'
import PresetOptions from './components/PresetOptions.vue'

</script>

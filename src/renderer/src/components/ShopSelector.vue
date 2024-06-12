//ShopSelector
<template>
  <div class="store-selector">
    <h2>门店选择</h2>
    <select v-model="selectedShop" @change="onShopChange">
      <option value="" disabled>无</option>
      <option v-for="shop in shops" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
    </select>
    <Button @click="loadShops">加载门店</Button>
    <div>
      <p>shop_id: {{ storeData.id }}</p>
      <p>store_id: {{ storeData.store_ids }}</p>
      <p>serial: {{ storeData.serial }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Button from 'primevue/button';

const selectedShop = ref('')
const shops = ref([])
const storeData = ref({})

const loadShops = async () => {
  try {
    const response = await axios.get('http://your-server-address/api/shops') // 替换为你的API地址
    shops.value = response.data
  } catch (error) {
    console.error('Failed to load shops:', error)
  }
}

const onShopChange = () => {
  const selected = shops.value.find(shop => shop.id === selectedShop.value)
  storeData.value = selected || {}
}
</script>

<style scoped>

</style>

//ShopSelector
<template>
  <div class="store-selector">
    <h2>门店选择</h2>
    <select v-model="selectedShop" @change="onShopChange">
      <option value="" disabled>选择一个门店</option>
      <option v-for="shop in shops" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
    </select>
    <button @click="loadShops">加载门店</button>
    <div>
      <h3>Store Data</h3>
      <p>Shop ID: {{ storeData.id }}</p>
      <p>Serial: {{ storeData.serial }}</p>
      <p>Store IDs: {{ storeData.store_ids }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

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
.store-selector {
  padding: 20px;
  border: 1px solid #ccc;
  margin-top: 20px;
}
</style>

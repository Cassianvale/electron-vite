<template>
  <div class="config-page">
    <h2>配置设置</h2>
    <form @submit.prevent="saveConfig">
      <div>
        <label for="backendURL">小吃机后台 URL</label>
        <input v-model="config.backendURL" id="backendURL" type="text" required />
      </div>
      <div>
        <label for="deliveryURL">外卖后台 URL</label>
        <input v-model="config.deliveryURL" id="deliveryURL" type="text" required />
      </div>
      <div>
        <label for="mysqlHost">MySQL 主机</label>
        <input v-model="config.mysqlHost" id="mysqlHost" type="text" required />
      </div>
      <div>
        <label for="mysqlUser">MySQL 用户</label>
        <input v-model="config.mysqlUser" id="mysqlUser" type="text" required />
      </div>
      <div>
        <label for="mysqlPassword">MySQL 密码</label>
        <input v-model="config.mysqlPassword" id="mysqlPassword" type="password" required />
      </div>
      <div>
        <label for="mysqlDatabase">MySQL 数据库</label>
        <input v-model="config.mysqlDatabase" id="mysqlDatabase" type="text" required />
      </div>
      <button type="submit">保存配置</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const config = ref({
  backendURL: '',
  deliveryURL: '',
  mysqlHost: '',
  mysqlUser: '',
  mysqlPassword: '',
  mysqlDatabase: '',
})

const loadConfig = async () => {
  const storedConfig = await window.api.loadConfig()
  if (storedConfig) {
    config.value = storedConfig
  }
}

const saveConfig = async () => {
  await window.api.saveConfig(config.value)
  alert('配置已保存')
}

onMounted(loadConfig)
</script>

<style scoped>
.config-page {
  padding: 20px;
}
.config-page div {
  margin-bottom: 10px;
}
</style>

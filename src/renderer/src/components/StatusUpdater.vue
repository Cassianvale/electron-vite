// StatusUpdater.vue
<template>
  <div class="status-updater">
    <h2>更新状态</h2>
    <input type="text" placeholder="state" />
    <input type="text" placeholder="change state" />
    <input type="text" placeholder="输入工单号" />
    <input type="text" value="D1" placeholder="输入取餐口" />
    <input type="text" placeholder="输入电磁炉编号(可选)" />
    <button>获取门店工单</button>
    <button>更新指令单</button>
    <button>正常流程</button>
    <button>预加热流程</button>
    <div>
      <button>1-2</button>
      <button>2-3</button>
      <button>3-4</button>
      <button>1-2-3</button>
    </div>
    <div>
      <button>1-2</button>
      <button>2-5</button>
      <button>5-3</button>
      <button>3-4</button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
/* Add your styles here */
</style>

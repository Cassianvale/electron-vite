// import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'


import 'element-plus/dist/index.css'
import 'tailwindcss/tailwind.css';
import './assets/css/global.scss'
import 'uno.css'

// import { use } from 'echarts/core';
import ECharts from 'vue-echarts';
// import { CanvasRenderer } from 'echarts/renderers';
// import { BarChart } from 'echarts/charts';
// import { GridComponent, TooltipComponent } from 'echarts/components';

// use([
//   CanvasRenderer,
//   BarChart,
//   GridComponent,
//   TooltipComponent
// ]);


const app = createApp(App)

const pinia = createPinia()

// 注册 vue-echarts 组件
app.component('v-chart', ECharts);
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')

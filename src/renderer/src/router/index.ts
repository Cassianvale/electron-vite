// src/renderer/src/router/index.ts

import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import ConfigPage from '../components/ConfigPage.vue'
import ShopSelector from '../components/ShopSelector.vue'



const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  { path: '/shops',
    component: ShopSelector,
    meta: {
      requiresAuth: true // 添加 meta 字段，标识需要登录才能访问
    }
  },
  { path: '/config',
    component: ConfigPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

// src/renderer/src/router/index.ts

import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import HomePage from '../components/HomePage.vue'
import NewsPage from '../components/NewsPage.vue'
import StatsChart from '../components/StatsChart.vue'
import ConfigPage from '../components/ConfigPage.vue'



const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  { path: '/home',
    component: HomePage,
    meta: {
      preload: true,
      requiresAuth: true
     }
  },
  {
    path: '/news',
    component: NewsPage,
  },
  {
    path: '/statschart',
    name: 'StatsChart',
    component: StatsChart
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

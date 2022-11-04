import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/axios',
    name: 'Axios',
    component: () => import('@/views/axios.vue') // 懒加载组件
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('@/views/game.vue')
  },
  {
    path: '/snake',
    name: 'snake',
    component: () => import('@/views/snake.vue')
  },
  {
    path: '/ocr',
    name: 'ocr',
    component: () => import('@/views/ocr.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

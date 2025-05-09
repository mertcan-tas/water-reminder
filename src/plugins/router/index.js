import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/home/HomeView.vue'
import SettingView from '@/views/setting/SettingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  linkExactActiveClass: '',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingView
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/errors/404'
    },
    {
      path: '/errors/404',
      name: 'error404',
      component: HomeView,
    },
  ],
})

export default router
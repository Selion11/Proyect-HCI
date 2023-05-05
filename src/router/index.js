// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/devices',
    name: 'DevicesView',
    component: () => import('@/views/DevicesView.vue'),
  },
  {
    path: '/routines',
    name: 'RoutinesView',
    component: () => import('@/views/RoutinesView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

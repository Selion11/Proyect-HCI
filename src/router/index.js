import {createRouter,createWebHistory} from "vue-router";
import HomeView from '../views/HomeView.vue'
import store from '../stores/destinations'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path:'/destination/:slug',
      name: 'destination',
      component: () => import('../views/DestinationView.vue'),
      props: true,
    },
    {
      path: '/about',
      component: () => import('../views/AboutView.vue'),
    meta: {requiresAuth: true }
    }
  ]
})

export default router

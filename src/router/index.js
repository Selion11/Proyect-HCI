import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "../stores/destinations";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/destination/:slug",
      name: "destinationdetails",
      component: () => import("../views/DestinationDetailsView.vue"),
      props: true,
      children: [
        {
          path: ":experienceSlug",
          name: "experiencedetails",
          props: true,
          component: () => import("../views/ExperienceDetailsView.vue")
        },
      ],
      beforeEnter: (to, from, next) => {
        const exists = store.destinations.find(
            (destination) => destination.slug === to.params.slug
        )

        if (exists) {
          next();
        } else {
          next({ name: "notfound" });
        }
      }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/user",
      name: "user",
      meta: { requiresAuth: true },
      component: () => import("../views/UserView.vue"),
    },
    {
      path: "/invoices",
      name: "invoices",
      meta: { requiresAuth: true },
      component: () => import("../views/InvoicesView.vue")
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (!store.user) {
      next({ name: "login", query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router

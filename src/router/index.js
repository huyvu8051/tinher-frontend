import Vue from 'vue'
import Router from 'vue-router'

import Store from "@/store/store";

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'slide',
      component: () => import("@/components/Slide")
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/components/Login")
    },
    {
      path: "/profile",
      name: "setting.profile",
      component: () => import("@/components/setting/Profile"),
    },
    {
      path: "/image",
      name: "setting.image",
      component: () => import("@/components/setting/ManageProfileImage"),
    }
  ]
})




router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Store.state.token) {
      next({
        name: "login"
      });
    } else {
      next()
    }
  }
  else {
    next()
  }
})


export default router;
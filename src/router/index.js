import Vue from 'vue'
import Router from 'vue-router'

import Store from "@/store/store";

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/app/',
      component: () => import("@/components/UserInterface"),
      children: [
        {
          path: 'slide',
          name: 'slide',
          component: () => import("@/components/Slide")
        },
        {
          path: 'userpage',
          name: 'userpage',
          component: () => import("@/components/UserPage")
        },

        {
          path: "profile",
          name: "setting.profile",
          component: () => import("@/components/setting/Profile"),
        },
        {
          path: "image",
          name: "setting.image",
          component: () => import("@/components/setting/ManageProfileImage"),
        },
        {
          path: "conversations",
          name: "conversations",
          component: () => import("@/components/chat/Conversations"),
        },
        {
          path: "chatMessages",
          name: "chatMessages",
          component: () => import("@/components/chat/ChatMessages"),
        },
        {
          path: "chat/:conversationId",
          name: "chat2",
          component: () => import("@/components/chat/Chat"),
        },
        {
          path: "chat2/:conversationId",
          name: "chat",
          component: () => import("@/components/chat/ChatV2"),
        },
      ]
    },
    {
      path: '/',
      component: () => import("@/components/GuestInterface"),
      children: [
        {
          path: '',
          name: 'login',
          component: () => import("@/components/Login")
        },
      ]
    },

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
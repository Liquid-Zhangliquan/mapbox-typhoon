import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes =
  [
    {
      path: '/',
      name: 'typhoon',
      component: () => import('../views/typhoon/typhoon.vue')
    },
  ]

const router = new VueRouter({ routes })

export default router

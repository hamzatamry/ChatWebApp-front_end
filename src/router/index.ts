import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('../views/MessagesView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

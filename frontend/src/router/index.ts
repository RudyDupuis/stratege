import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PlayView from '@/views/PlayView.vue'
import RulesView from '@/views/RulesView.vue'
import MyProfileView from '@/views/MyProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/jouer',
      name: 'play',
      component: PlayView
    },
    {
      path: '/regles',
      name: 'rules',
      component: RulesView
    },
    {
      path: '/mon-profil',
      name: 'my-profile',
      component: MyProfileView
    }
  ]
})

export default router

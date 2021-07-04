import { createRouter, createWebHistory } from 'vue-router'
import Recommend from '@/views/recommend.vue'
import Album from '@/views/album.vue'
import Singer from '@/views/singer.vue'
import SingerDetail from '@/views/singer-detail.vue'
import TopList from '@/views/top-list.vue'
import Search from '@/views/search.vue'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        name: 'RecommendDetail',
        component: Album,
        path: ':id'
      }
    ]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        name: 'SingerDetail',
        component: SingerDetail,
        path: ':id'
      }
    ]
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: TopList
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

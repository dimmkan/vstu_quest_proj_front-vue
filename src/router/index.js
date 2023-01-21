import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: AuthView
    },
    {
      path: '/logout',
      name: 'logout',
      redirect: '/'
    },
    {
      path: '/candidates',
      name: 'candidates',
      component: () => import('../views/CandidatesView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/PageNotFound.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.payload) next({ name: 'login' })
  else next()
})

export default router

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
  let payload = localStorage.payload;
  if (typeof localStorage.payload === 'string') {
    payload = JSON.parse(localStorage.payload)
  } 
  if (to.name !== 'login' && !payload.isAuth) next({ name: 'login' })
  else next()
})

export default router

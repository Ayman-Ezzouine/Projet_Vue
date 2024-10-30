import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/create-workflow',
    name: 'CreateWorkflow',
    component: () => import('../views/CreateWorkflow.vue')
  },
  {
    path: '/check-status/:id?',
    name: 'CheckStatus',
    component: () => import('../views/CheckStatus.vue'),
    props: true
  },
  {
    path: '/train-model',
    name: 'TrainModel',
    component: () => import('../views/TrainModel.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
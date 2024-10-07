import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CreateWorkflow from '../views/CreateWorkflow.vue';
import CheckStatus from '../views/CheckStatus.vue';
import TrainModel from '../views/TrainModel.vue';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: Home
  },
  {
    path: '/create-workflow',
    name: 'CreateWorkflow',
    component: CreateWorkflow
  },
  {
    path: '/check-status',
    name: 'CheckStatus',
    component: CheckStatus
  },
  {
    path: '/train-model',
    name: 'TrainModel',
    component: TrainModel
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

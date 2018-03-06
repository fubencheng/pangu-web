import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import About from '@/components/navigation/About';
import Qa from '@/components/navigation/Qa';

export default new Router({
  routes: [
    {
      path: '/',
      component: About
    },
    {
      path:'/qa',
      component:Qa
    },
  ]
})

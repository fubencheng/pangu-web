import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import About from '@/components/navigation/About'

export default new Router({
  routes: [
    {
      path: '/',
      component: About
    }
  ]
})

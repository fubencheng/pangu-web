import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import About from '@/components/navigation/About';
import Qa from '@/components/navigation/Qa';

import QaAskQuestion from '@/components/qa/QaAskQuestion';
import QaQuestionDetail from '@/components/qa/QaQuestionDetail';

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
    {
      path:'/qa/ask/question',
      component:QaAskQuestion
    },
    {
      path:'/qa/question/detail/:questionId',
      component:QaQuestionDetail
    }
  ]
})

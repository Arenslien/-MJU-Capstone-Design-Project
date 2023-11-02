import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login'
import Category from '@/components/Category'
import MyPage from '@/components/MyPage'
import Recommend from '@/components/Recommendation'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/category',
      name: 'Category',
      component: Category
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    }
  ]
})

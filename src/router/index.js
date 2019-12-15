import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Cidade from '../views/CidadePage.vue'
import Campanha from '../views/CampanhaPage.vue'
import GrupCidade from '../views/GrupoCidadePage'
import Desconto from '../views/DescontoPage'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
    {
        path: '/cidade',
        name: 'cidade',
        component: Cidade
    },
    {
        path: '/grpcidade',
        name: 'grupo_cidade',
        component: GrupCidade
    },
    {
        path: '/desconto',
        name: 'desconto',
        component: Desconto
    },

    {
      path: '/campanha',
      name: 'campanha',
      component: Campanha
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

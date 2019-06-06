import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/csagentchat/',
  routes: [
    {
      path: '/',
      name: 'home'
    }, {
      path: '/contact',
      name: 'contact',
      component: r => require.ensure([], () => r(require('./views/Contact.vue'))),
      children: [
        {
          path: ':id',
          name: 'contactitem',
          component: r => require.ensure([], () => r(require('./views/ContactItem.vue'))),
        }
      ]
    }
  ]
})

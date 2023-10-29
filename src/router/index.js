import Vue from 'vue'
import Router from 'vue-router'
import Landlord from '@/components/Landlord'
import Museum from '@/components/Museum'
import Lobby from '@/components/Lobby'
import Stats from '@/components/Stats'
import Logs from '@/components/Logs'
import Verify from '@/components/Verify'
import Login from '@/components/Login'
import GoTrue from 'gotrue-js'

const auth = new GoTrue({
  APIUrl: 'https://admin.exitpuzzles.com/.netlify/identity'
});

Vue.use(Router)

let router = new Router({
  routes: [

    { path: '/invite_token=:token',       component: Verify,     meta: { anonymous: true },    props:true                },
    { path: '/login',                     component: Login,      meta: { anonymous: true }                               },
    { path: '/lobby',                     component: Lobby,      meta: { title: 'Lobby',       icon: 'chair' } },
    { path: '/landlord',                  component: Landlord,   meta: { title: 'Landlord',    icon: 'business' }        },
    { path: '/museum',                    component: Museum,     meta: { title: 'Museum',      icon: 'account_balance' } },
    { path: '/logs',                      component: Logs,       meta: { title: 'Logs',        icon: 'dvr' }             },
    { path: '/stats',                     component: Stats,      meta: { title: 'Stats',       icon: 'poll' }            },
    { path: '/',                          component: Landlord,                                                           }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(from.path + ' -> ' + to.path)

  if (to.meta && !to.meta.anonymous && !auth.currentUser()) {
    next({
      path: '/login'
    })
  } else {
    next()
  } 
})

router.afterEach((to, from) => {
  if (!to.meta.title && to.path == '/') {
    to.meta.title = 'Landlord'
  } else if (!to.meta.title && to.path == '/login') {
    to.meta.title = 'Login'
  }

  document.title = to.meta.title
})

export default router
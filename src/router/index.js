import Vue from 'vue'
import Router from 'vue-router'
import Control from '@/components/Control'
import Museum from '@/components/Museum'
import MuseumMock from '@/components/Museum.Mock'
import Settings from '@/components/Settings'
import Stats from '@/components/Stats'
import Mock from '@/components/Mock'
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

    { path: '/invite_token=:token',       component: Verify,     meta: { anonymous: true }, props:true                   },
    { path: '/login',                     component: Login,      meta: { anonymous: true }                               },
    { path: '/landlord',                  component: Control,    meta: { title: 'Landlord',    icon: 'business' }        },
    { path: '/museum',                    component: Museum,     meta: { title: 'Museum',      icon: 'account_balance' } },
    { path: '/museum/mock',               component: MuseumMock, meta: { title: 'Museum Mock', icon: 'account_balance' } },
    { path: '/logs',                      component: Logs,       meta: { title: 'Logs',        icon: 'dvr' }             },
    { path: '/settings',                  component: Settings,   meta: { title: 'Settings',    icon: 'settings' }        },
    { path: '/stats',                     component: Stats,      meta: { title: 'Stats',       icon: 'poll' }            },
    { path: '/mock',                      component: Mock,                                                               },
    { path: '/',                          component: Control,    meta: { title: 'Landlord',    icon: 'business' }        }
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
  if (to.meta && !to.meta.anonymous) {
    document.title = `${to.meta.title}`
  }
})

export default router
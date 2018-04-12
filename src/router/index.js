import Vue from 'vue'
import Router from 'vue-router'
import Control from '@/components/Control'
import Settings from '@/components/Settings'
import Stats from '@/components/Stats'
import Logs from '@/components/Logs'
import Verify from '@/components/Verify'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [

    { path: '/invite_token=:token',       component: Verify,   meta: { anonymous: true }, props:true         },
    { path: '/Login',                     component: Login,    meta: { anonymous: true }                     },
    { path: '/control',                   component: Control,  meta: { title: 'Control',  icon: 'pan_tool' } },
    { path: '/logs',                      component: Logs,     meta: { title: 'Logs',     icon: 'dvr'      } },
    { path: '/settings',                  component: Settings, meta: { title: 'Settings', icon: 'settings' } },
    { path: '/stats',                     component: Stats,    meta: { title: 'Stats',    icon: 'poll'     } },
    { path: '/',                          component: Control,                                                }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import Control from '@/components/Control'
import Settings from '@/components/Settings'
import Stats from '@/components/Stats'
import Logs from '@/components/Logs'
import Verify from '@/components/Verify'

Vue.use(Router)

// { path: '/hello/:name', component: Hello, props: true }, // Pass route.params to props

export default new Router({
  routes: [

    { path: '/confirmation_token=:token', component: Verify,   props:true                                    },
    { path: '/control',                   component: Control,  meta: { title: 'Control',  icon: 'pan_tool' } },
    { path: '/logs',                      component: Logs,     meta: { title: 'Logs',     icon: 'dvr'      } },
    { path: '/settings',                  component: Settings, meta: { title: 'Settings', icon: 'settings' } },
    { path: '/stats',                     component: Stats,    meta: { title: 'Stats',    icon: 'poll'     } },
    { path: '/',                          component: Control,                                                }
  ]
})

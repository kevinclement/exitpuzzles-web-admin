import Vue from 'vue'
import Router from 'vue-router'
import Control from '@/components/Control'
import Settings from '@/components/Settings'
import Stats from '@/components/Stats'
import Logs from '@/components/Logs'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/',         component: Control },
    { path: '/control',  component: Control },
    { path: '/settings', component: Settings },
    { path: '/stats',    component: Stats },
    { path: '/logs',     component: Logs }
  ]
})

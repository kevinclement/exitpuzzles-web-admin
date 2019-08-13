// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Firebase from 'firebase'
import VueFire from 'vuefire'
import Operations from './Operations'
import GoTrue from 'gotrue-js'

// init auth
const auth = new GoTrue({
  APIUrl: 'https://admin.exitpuzzles.com/.netlify/identity'
});

// init firebase
let dbUrl = process.env.NODE_ENV === 'development' ? "https://exitpuzzles-admin-dev.firebaseio.com" : "https://exitpuzzles-admin.firebaseio.com"
let config = { databaseURL: dbUrl }
let db = Firebase.initializeApp(config).database()
let operations = new Operations(db, 'operations')
let museumOps = new Operations(db, 'museum/operations')
let museumRoot = db.ref('museum')

Vue.use(Vuetify)
Vue.use(VueFire)

Vue.config.productionTip = false

// set global to test for dev/prod mode
window['DEV_MODE'] = process.env.NODE_ENV

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    fbdb: db,
    operations: operations,
    museumOps: museumOps,
    museumRoot: museumRoot,
    auth: auth,
    loggedInCallback: null
  }
})

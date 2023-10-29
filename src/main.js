// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Firebase from 'firebase'
import Operations from './Operations'
import Runs from './Runs'
import GoTrue from 'gotrue-js'

// init auth
const auth = new GoTrue({
  APIUrl: 'https://admin.exitpuzzles.com/.netlify/identity'
});

// set global to test for dev/prod mode, can be overridden by setting DEV_MODE=production in environment before building
window['DEV_MODE'] = process.env.NODE_ENV === 'development' && process.env.DEV_MODE !== 'production'

// init firebase
let dbUrl = window['DEV_MODE'] ? "https://exitpuzzles-admin-dev.firebaseio.com" : "https://exitpuzzles-admin.firebaseio.com"
let config = { databaseURL: dbUrl }
let fb = Firebase.initializeApp(config)
let db = fb.database()
let storage = fb.storage('exitpuzzles-admin.appspot.com')
let operations = new Operations(db, 'landlord/operations')
let museumRuns = new Runs(db, 'museum/runs')
let museumOps = new Operations(db, 'museum/operations')
let museumRoot = db.ref('museum')
let lobbyOps = new Operations(db, 'lobby/operations')
let lobbyRoot = db.ref('lobby')

Vue.use(Vuetify)

Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    fbdb: db,
    fbstorage: storage,
    operations: operations,
    museumOps: museumOps,
    museumRoot: museumRoot,
    museumRuns: museumRuns,
    lobbyOps: lobbyOps,
    lobbyRoot: lobbyRoot,
    auth: auth,
    loggedInCallback: null
  }
})

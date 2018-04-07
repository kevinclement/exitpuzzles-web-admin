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

// TODO: secrets are not checked in, is there a cleaner way to do this?
let config = {
  apiKey: "AIzaSyBq1tyRDtpAkMFwi3ZIkS24cBBG3r0EUqU",
  authDomain: "exitpuzzles-admin.firebaseapp.com",
  databaseURL: "https://exitpuzzles-admin.firebaseio.com",
  projectId: "exitpuzzles-admin",
  storageBucket: "exitpuzzles-admin.appspot.com",
  messagingSenderId: "927373652924"
}

// init firebase
let db = Firebase.initializeApp(config).database()
let operations = new Operations(db)

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
    operations: operations
  }
})

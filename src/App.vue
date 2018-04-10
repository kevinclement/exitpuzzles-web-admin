<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app 
      v-if="authenticated">
      <v-list>
        <v-list-tile ripple v-for="item in items" :key="item.title" @click="navigate(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app>
      <v-toolbar-side-icon v-if="authenticated" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Exit Puzzles Admin</v-toolbar-title>
    </v-toolbar>
    <v-content v-if="authenticated">
      <router-view/>
    </v-content>
    <v-content v-if="!authenticated">
      <login :callback="loggedIn"/>
    </v-content>
  </v-app>
</template>

<script>
import Login from '@/components/Login'

export default {
  data () {
    return {
      drawer: false,
      items: [],
      user: null
    }
  },

  computed: {
    authenticated () {
        return this.user !== null
    }
  },

  mounted() {

    // dynamically build up navigation menu based on routes so we don't 
    // have config in two places
    for (let i=0; i < this.$router.options.routes.length; i++) {
      let route = this.$router.options.routes[i]
      let meta = route.meta

      if (meta) {
        this.items.push({ title: meta.title, icon: meta.icon, url: route.path})
      }
    }
  },

  methods: {
    navigate: function (item) {
      this.$router.push(item.url)
    }, 
    loggedIn: function(user) {
      this.user = user
    }
  },

  components: {
    'login': Login
  },

  name: 'App'
}
</script>

<style scoped>
.breadcrumbs {
  margin-left: 60px;
}
</style>



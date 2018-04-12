<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app 
      v-if="authenticated">
      <v-list subheader>
        <v-subheader>Signed in as {{user.user_metadata.full_name}}</v-subheader>
        <v-divider></v-divider>
        <v-list-tile ripple v-for="item in items" :key="item.title" @click="navigate(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile ripple @click="logOut()">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app>
      <v-toolbar-side-icon v-if="authenticated" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Exit Puzzles Admin</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
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
    }, 
    anonymousRoute () {
      return this.$router.currentRoute.meta && this.$router.currentRoute.meta.anonymous
    }
  },

  mounted() {
    // dynamically build up navigation menu based on routes so we don't 
    // have config in two places
    for (let i=0; i < this.$router.options.routes.length; i++) {
      let route = this.$router.options.routes[i]
      let meta = route.meta

      if (meta && !meta.anonymous) {
        this.items.push({ title: meta.title, icon: meta.icon, url: route.path})
      }
    }

    this.$root.$data.loggedInCallback = (user) => { this.user = user }

    // check if auth was saved
    let currentUser = this.$root.$data.auth.currentUser();
    if (currentUser) {
        console.log("Auto login as %s", currentUser.email)
        this.user = currentUser
    }
  },

  methods: {
    navigate: function (item) {
      this.$router.push(item.url)
    }, 
    logOut() {
      this.user.logout().then(
        response => { 
          this.user = null
          this.$router.push('/login')
        },
        error => console.log("Failed to logout user: %o", error)
      );
    }
  },

  name: 'App'
}
</script>

<style scoped>
.breadcrumbs {
  margin-left: 60px;
}
</style>



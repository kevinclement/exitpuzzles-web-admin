<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile v-for="item in items" :key="item.title" @click="navigate(item)">
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
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Exit Puzzles Admin</v-toolbar-title>
      <v-breadcrumbs class="breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item
          v-for="bc in breadcrumbs"
          :key="bc.text"
          :disabled="bc.disabled"
        >
          {{ bc.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
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
      items: [
        { title: 'Control', icon: 'pan_tool', url: '/control'},
        { title: 'Settings', icon: 'settings', url: '/settings'},
        { title: 'Stats', icon: 'poll', url: '/stats'},
        { title: 'Logs', icon: 'dvr', url: '/logs'}
      ],
      breadcrumbs: [
        { text: 'Logs' },
        { text: 'a specific log' }
      ]
    }
  },

  methods: {
    navigate: function (item) {
      this.$router.push(item.url)
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



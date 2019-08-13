<template>
  <v-container fluid>
      museum
      <span>right: {{ showDetails }}</span>
      <a v-on:click.stop="showDetails = true">show</a>
      <v-navigation-drawer
        v-model="showDetails"
        fixed
        app
        clipped
        right
        dense
        class="rightDrawer"
        hide-overlay = "true"
      >
      <v-toolbar card color="white">
        <v-toolbar-title>TITLE</v-toolbar-title>
        <span class="spacer" />
        <a v-on:click.stop="showDetails = false"><v-icon @click.native="">close</v-icon></a>
      </v-toolbar>

      </v-navigation-drawer>

      <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
        {{ snackText }}
        <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data () {
    return {

      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',
      showDetails: true,
      alert:false,
    }
  },

  computed: {
  },

  mounted() {
  },

  methods: {
    showSnack(msg) {
      this.snackText = msg 
      this.snackbar = true
    }
  },

  components: {
  }
}
</script>

<style scoped>
  .rightDrawer {

    z-index:1;
  }
  
</style>

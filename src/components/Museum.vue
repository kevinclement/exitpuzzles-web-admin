<template>
  <v-container fluid>
    <v-navigation-drawer fixed app clipped right dense
      v-model="showDetails"
      class="rightDrawer"
      hide-overlay = "true"
    >
      <v-toolbar card color="white">
        <v-toolbar-title>TITLE</v-toolbar-title>
        <span class="spacer" />
        <a v-on:click.stop="showDetails = false"><v-icon>close</v-icon></a>
      </v-toolbar>
    </v-navigation-drawer>

    <museum-mummy :snack="showSnack" :operations="operations"></museum-mummy>
    
    <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
      {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Mummy from '@/components/Museum.Mummy'
export default {
  data () {
    return {
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',
      showDetails: false,
      operations: "a string",
    }
  },

  created () {
    this.operations =  this.$root.$data.museumOps
  },

  methods: {
    showSnack(msg) {
      this.snackText = msg 
      this.snackbar = true
    }
  },

  components: {
    'museum-mummy': Mummy,
  }
}
</script>

<style scoped>
  .rightDrawer {
    z-index:1;
  }
  
</style>

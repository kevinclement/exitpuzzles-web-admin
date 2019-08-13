<template>
  <v-container fluid>
    <v-navigation-drawer fixed app clipped right dense
      v-model="showDetails"
      class="rightDrawer"
      :hide-overlay="true"
    >
      <museum-mummy-advanced v-on:close-details="showDetails = false"></museum-mummy-advanced>
    </v-navigation-drawer>

    <museum-mummy v-on:show-details="showDetails = true" :snack="showSnack" :operations="operations"></museum-mummy>

    <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
      {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Mummy from '@/components/Museum.Mummy'
import MummyAdvanced from '@/components/Museum.Mummy.Advanced'

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
    'museum-mummy-advanced': MummyAdvanced,
  }
}
</script>

<style scoped>
  .rightDrawer {
    z-index:1;
  }
  
</style>

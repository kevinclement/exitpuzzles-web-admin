<template>
  <v-container fluid>
    <v-navigation-drawer fixed app clipped right dense
      v-model="showDetails"
      class="rightDrawer"
      :hide-overlay="true"
      :stateless="true"
    >
      <museum-mummy-advanced 
        v-on:close-details="advanced.mummy = false"
        v-if="advanced.mummy == true"
        :operations="operations"/>
    </v-navigation-drawer>

    <museum-mummy v-on:show-details="advanced.mummy = true" :snack="showSnack" :operations="operations"/>

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
      advanced: {
        mummy: false,
      },
      showDetails: false,
      operations: {},
    }
  },

  watch: {
    advanced: {
      handler(val){
        // this took me too long to figure out, flashback to mvvm reactive crap :'(
        this.showDetails = this.advanced[Object.keys(val)[0]];
      },
      deep: true
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

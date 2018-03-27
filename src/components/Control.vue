<template>
  <v-container fluid>
      <control-tnt :snack="showSnack"></control-tnt>
      <control-morse></control-morse>
      <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
        {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import TNT from '@/components/Control.TNT'
import Morse from '@/components/Control.Morse'

export default {
  data () {
    return {

      // shared snack stuff
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',

    }
  },

  methods: {
    showSnack(msg) {
      this.snackText = msg 
      this.snackbar = true
    }
  },


  components: {
    'control-tnt': TNT,
    'control-morse': Morse
  }
}
</script>

<style scoped>

</style>

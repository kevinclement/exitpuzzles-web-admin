<template>
  <v-container fluid>
      museum
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
</style>

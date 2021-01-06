<template>
  <v-container fluid>
      <v-alert
        color="error"
        :value="alert"
        icon="new_releases"
        transition="scale-transition"
      >
        Raspberry Pi is offline.  Last ping at {{piPingFormatted}}. See <router-link style="color:white" to="/logs">logs</router-link> for more info.
      </v-alert>
      <control-tnt :snack="showSnack"></control-tnt>
      <control-audio :snack="showSnack"></control-audio>
      <control-morse :snack="showSnack"></control-morse>
      <control-painting :snack="showSnack"></control-painting>

      <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
        {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import TNT from '@/components/Landlord.TNT'
import Morse from '@/components/Landlord.Morse'
import Audio from '@/components/Landlord.Audio'
import Painting from '@/components/Landlord.Painting'

// how much time before we know pi isn't connected (in seconds)
const PI_TIMEOUT_SECONDS = 95

export default {
  data () {
    return {

      // shared snack stuff
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',
      alert:false,
      piPing:0
    }
  },

  computed: {
    piPingFormatted: function() {
      return (new Date(this.piPing)).toLocaleString()
    }
  },

  mounted() {

    this.statusRef = this.$root.$data.fbdb.ref('landlord/status')
    this.statusRef.on('value', (snapshot) => {
      let status = snapshot.val()
      if (status == null) return

      if (status.piPing) {
        this.piPing = status.piPing
      }
    })

    setInterval(() => {
      // check to make sure pi is still connected
      // pi will write ping time 
      let now = (new Date()).getTime()
      let elapsedSeconds = Math.floor((now - this.piPing) / 1000)

      if (elapsedSeconds > PI_TIMEOUT_SECONDS) {
        this.alert = true
      } else {
        this.alert = false
      }
    }, 1000)
  },

  methods: {
    showSnack(msg) {
      this.snackText = msg 
      this.snackbar = true
    }
  },

  components: {
    'control-tnt': TNT,
    'control-morse': Morse,
    'control-audio': Audio,
    'control-painting': Painting
  }
}
</script>

<style scoped>
</style>

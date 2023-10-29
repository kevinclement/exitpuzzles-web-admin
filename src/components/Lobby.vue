<template>
  <v-container fluid>
    <!-- connection alert -->
    <v-alert
        :value="deviceStatusString != ''"
        color="error"
        icon="new_releases"
        transition="scale-transition"
      >
        <span v-html="deviceStatusString"/>
    </v-alert>

    <!-- controls -->
    <v-subheader class="roomHeader" style="padding-right:0px;">
      Lobby:
    </v-subheader>
    <lobby-raven
      :snack="showSnack" 
      :operations="operations"/>

    <!-- snackbar notifications -->
    <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
      {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>

  </v-container>
</template>

<script>

import Raven from '@/components/Lobby.Raven'

const DEVICE_TIMEOUT_SECONDS = 95

export default {
  data () {
    return {
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',
      status: [],
      operations: {}
    }
  },
  computed: {
    deviceStatusString: function() {
      let status = ""

      for (const [name, device] of Object.entries(this.status)) {
        let dev = this.status[name]
        if (!dev.connected) {
          status += `Device '${dev.name}' is offline.  Last ping at ${dev.ping}<br/>`
        }
      }

      return status
    }
  },
  created () {
    this.operations =  this.$root.$data.lobbyOps

    this.$root.$data.lobbyRoot.child('status').on('value', (snapshot) => {
        let status = snapshot.val()
        if (status == null) return

        let ds = {}
        for (const [name, device] of Object.entries(status)) {
          let connected = true
          let dev = status[name]
          let delta = (new Date()).getTime() - (new Date(dev.ping)).getTime()

          if (delta > (DEVICE_TIMEOUT_SECONDS * 1000)) {
            connected = false
          }

          ds[name] = {
            "name": name,
            "ping": dev.ping,
            "connected": connected
          }
        }

        this.status = ds
      })
  },

  methods: {
    showSnack(msg) {
      this.snackText = msg 
      this.snackbar = true
    }
  },

  components: {
     'lobby-raven': Raven,
  }
}
</script>

<style scoped>
  .roomHeader {
    font-size:18px;
    padding-left:0px;
    margin-left:0px;
    margin-bottom:0px;
    padding-bottom:0px;
    height:30px;
  }
</style>

<!-- GLOBAL CSS -->
<style>
  
</style>

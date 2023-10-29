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

    <!-- advanced panels -->
    <v-navigation-drawer fixed app clipped right dense
      v-model="showDetails"
      class="rightDrawer"
      :hide-overlay="true"
      :stateless="true"
    >
      <lobby-raven-advanced 
        v-if="advanced.raven == true"
        :operations="operations"/>
    </v-navigation-drawer>

    <!-- controls -->
    
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
import RavenAdvanced from '@/components/Lobby.Raven.Advanced'

const DEVICE_TIMEOUT_SECONDS = 95

export default {
  data () {
    return {
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',
      status: [],
      operations: {},
      advanced: {
        lobby: false,
      },
      showDetails: false,
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
    
    // event handlers for children
    this.$root.$on('show-details', this.showAdvanced)
    this.$root.$on('close-details', this.hideAdvanced)


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
    showAdvanced(panel) {
      let show = !this.advanced[panel]

      // make sure others are closed first, this also acts as a toggle
      this.hideAdvanced();

      if (show) {
        this.advanced[panel] = true;
        this.showDetails = true;
      }
    },
    hideAdvanced() {
      for (const panel of Object.keys(this.advanced)) {
        this.advanced[panel] = false
      }
      this.showDetails = false;
    },
    showSnack(msg) {
      this.snackText = msg 
      this.snackbar = true
    }
  },

  components: {
     'lobby-raven': Raven,
     'lobby-raven-advanced': RavenAdvanced,
  }
}
</script>

<style scoped>
  .rightDrawer {
    z-index:1;
  }
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
  .toolbar .toolbar__content>:not(.btn):not(.menu):first-child:not(:only-child),
  .toolbar .toolbar__extension>:not(.btn):not(.menu):first-child:not(:only-child) {
    margin-left: 10px !important;
  }

</style>

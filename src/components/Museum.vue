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
      <museum-mummy-advanced 
        v-on:close-details="toggleAdvanced('mummy')"
        v-if="advanced.mummy == true"
        :operations="operations"/>
      
      <museum-map-advanced 
        v-on:close-details="toggleAdvanced('map')"
        v-if="advanced.map == true"
        :operations="operations"/>
    </v-navigation-drawer>

    <!-- controls -->
    <v-subheader class="roomHeader">Front Room:</v-subheader>
    <museum-hands 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-clock 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-quiz 
      :snack="showSnack" 
      :operations="operations"
      :isConnected="status.quiz && status.quiz.connected"/>

    <museum-birdcage 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-map 
      v-on:show-details="toggleAdvanced('map')" 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-zoltar 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-cabinet 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    
    <v-subheader class="roomHeader" style="margin-top:20px;">Back Room:</v-subheader>
    <museum-laser 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-mausoleum
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-mummy 
      v-on:show-details="toggleAdvanced('mummy')" 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-stairs
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <!-- snackbar notifications -->
    <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
      {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>

    <!-- shared reboot dialog since all devices have similar logic -->
    <v-dialog v-model="dialogRebootShow" max-width="410">
    <v-card>
      <v-card-title class="headline">Really reboot the {{dialogRebootDevice}}?</v-card-title>
      <v-card-text>This will reboot the device and all current state lost.  Are you <i>sure</i> you want to do that?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="dialogRebootShow = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerReboot">Yes</v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import Zoltar from '@/components/Museum.Zoltar'
import Hands from '@/components/Museum.Hands'
import Cabinet from '@/components/Museum.Cabinet'
import Laser from '@/components/Museum.Laser'
import Clock from '@/components/Museum.Clock'
import Quiz from '@/components/Museum.Quiz'
import Birdcage from '@/components/Museum.Birdcage'
import Map from '@/components/Museum.Map'
import MapAdvanced from '@/components/Museum.Map.Advanced'
import Mausoleum from '@/components/Museum.Mausoleum'
import Mummy from '@/components/Museum.Mummy'
import MummyAdvanced from '@/components/Museum.Mummy.Advanced'
import Stairs from '@/components/Museum.Stairs'

const DEVICE_TIMEOUT_SECONDS = 95

export default {
  data () {
    return {
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',
      advanced: {
        mummy: false,
        map: false
      },
      status: [],
      showDetails: false,
      dialogRebootShow: false,
      dialogRebootDevice: "",
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
    this.operations =  this.$root.$data.museumOps

    this.$root.$data.museumRoot.child('status').on('value', (snapshot) => {
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
    toggleAdvanced(panel)  {
      let state = !this.showDetails;

      this.advanced[panel] = state;
      this.showDetails = state;
    },
    showSnack(msg) {
      this.snackText = msg 
      this.snackbar = true
    },
    triggerReboot() {
      this.operations.add({ command: `${this.dialogRebootDevice}.reboot` }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.snack('Device rebooted successfully.')
        }
      });
      this.dialogRebootShow = false
    },
    showRebootDialog(device) {
      this.dialogRebootDevice = device
      this.dialogRebootShow = true
    },
    getStatus(dev) {
      return this.status[dev].connected
    }
  },

  components: {
    'museum-zoltar': Zoltar,
    'museum-hands': Hands,
    'museum-cabinet': Cabinet,
    'museum-laser': Laser,
    'museum-clock': Clock,
    'museum-quiz': Quiz,
    'museum-birdcage': Birdcage,
    'museum-map': Map,
    'museum-map-advanced': MapAdvanced,
    'museum-mausoleum': Mausoleum,
    'museum-mummy': Mummy,
    'museum-mummy-advanced': MummyAdvanced,
    'museum-stairs': Stairs,
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
<style>
  
</style>

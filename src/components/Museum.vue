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
        v-if="advanced.mummy == true"
        :operations="operations"/>
      
      <museum-map-advanced 
        v-if="advanced.map == true"
        :operations="operations"/>

      <museum-cabinet-advanced 
        v-if="advanced.cabinet == true"
        :operations="operations"/>

      <museum-hands-advanced 
        v-if="advanced.hands == true"
        :operations="operations"/>

      <museum-quiz-advanced 
        v-if="advanced.quiz == true"
        :operations="operations"/>
    </v-navigation-drawer>

    <!-- controls -->
    <v-subheader class="roomHeader">Front Room:</v-subheader>
    <museum-hands 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-clock 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-quiz 
      :snack="showSnack" 
      :operations="operations"
      :isConnected="status.quiz && status.quiz.connected"/>

    <museum-birdcage 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-map 
      :snack="showSnack" 
      :operations="operations"
      :isConnected="status.map && status.map.connected"/>

    <museum-zoltar 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-cabinet 
      :snack="showSnack" 
      :operations="operations"/>

    <v-subheader class="roomHeader" style="margin-top:20px;">Back Room:</v-subheader>
    <museum-laser 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-mausoleum
      :snack="showSnack" 
      :operations="operations"/>

    <museum-mummy 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-stairs
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
import HandsAdvanced from '@/components/Museum.Hands.Advanced'
import Cabinet from '@/components/Museum.Cabinet'
import CabinetAdvanced from '@/components/Museum.Cabinet.Advanced'
import Laser from '@/components/Museum.Laser'
import Clock from '@/components/Museum.Clock'
import Quiz from '@/components/Museum.Quiz'
import QuizAdvanced from '@/components/Museum.Quiz.Advanced'
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
        map: false,
        hands: false,
        quiz: false
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

    // event handlers for children
    this.$root.$on('show-details', this.showAdvanced)
    this.$root.$on('close-details', this.hideAdvanced)
    this.$root.$on('reboot-device', this.showRebootDialog)

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
    showAdvanced(panel) {
      // make sure others are closed first
      this.hideAdvanced();

      let state = !this.showDetails;

      this.advanced[panel] = state;
      this.showDetails = state;
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
    'museum-hands-advanced': HandsAdvanced,
    'museum-cabinet': Cabinet,
    'museum-cabinet-advanced': CabinetAdvanced,
    'museum-laser': Laser,
    'museum-clock': Clock,
    'museum-quiz': Quiz,
    'museum-quiz-advanced': QuizAdvanced,
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

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

    <!-- reset dialog -->
    <museum-reset-dialog v-if="dialogReset" 
      :operations="operations" />

    <!-- advanced panels -->
    <v-navigation-drawer fixed app clipped right dense
      v-model="showDetails"
      class="rightDrawer"
      :class="{ largerDrawer: largerDrawer }"
      :hide-overlay="true"
      :stateless="true"
    >
      <museum-timer-advanced 
        v-if="advanced.timer == true"
        :operations="operations"/>

      <museum-hands-advanced 
        v-if="advanced.hands == true"
        :operations="operations"/>

      <museum-clock-advanced 
        v-if="advanced.clock == true"
        :operations="operations"/>

      <museum-quiz-advanced 
        v-if="advanced.quiz == true"
        :operations="operations"/>

      <museum-birdcage-advanced
        v-if="advanced.bird == true"
        :operations="operations"/>

      <museum-map-advanced 
        v-if="advanced.map == true"
        :operations="operations"/>

      <museum-zoltar-advanced 
        v-if="advanced.zoltar == true"
        :operations="operations"/>

      <museum-cabinet-advanced 
        v-if="advanced.cabinet == true"
        :operations="operations"/>

      <museum-laser-advanced 
        v-if="advanced.laser == true"
        :operations="operations"/>

      <museum-mausoleum-advanced 
        v-if="advanced.mausoleum == true"
        :operations="operations"/>

      <museum-mummy-advanced 
        v-if="advanced.mummy == true"
        :operations="operations"/>

      <museum-stairs-advanced 
        v-if="advanced.stairs == true"
        :operations="operations"/>

    </v-navigation-drawer>

    <!-- controls -->
    <v-subheader class="roomHeader" style="padding-right:0px;">
      Front Room:
      <span class="spacer" />
      <v-btn flat small color="blue lighten-3" style="margin-right:0px;" @click.native="dialogStartConfirm = true">Start</v-btn>
      <v-btn flat small color="red lighten-3" style="margin-right:0px;" @click.native="dialogResetConfirm = true">Reset</v-btn>
    </v-subheader>
    <museum-timer 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-hands 
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

    <museum-mummy 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-stairs
      :snack="showSnack" 
      :operations="operations"/>

    <museum-clock 
      :snack="showSnack" 
      :operations="operations"/>

    <museum-mausoleum
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

    <v-dialog v-model="dialogResetConfirm" max-width="410">
      <v-card>
        <v-card-title class="headline">Really reset all devices?</v-card-title>
        <v-card-text>This will reboot and reset all the devices in the room. Are you <i>sure</i> you want to do that?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click.native="dialogResetConfirm = false;">No</v-btn>
          <v-btn color="primary" flat="flat" @click.native="dialogResetConfirm = false;dialogReset = true;">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogStartConfirm" max-width="410">
      <v-card>
        <v-card-title class="headline">Really start the room?</v-card-title>
        <v-card-text>This will start the timer for the room. Are you <i>sure</i> you want to do that?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click.native="dialogStartConfirm = false;">No</v-btn>
          <v-btn color="primary" flat="flat" @click.native="startRoom">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>

import Timer from '@/components/Museum.Timer'
import TimerAdvanced from '@/components/Museum.Timer.Advanced'
import Hands from '@/components/Museum.Hands'
import HandsAdvanced from '@/components/Museum.Hands.Advanced'
import Clock from '@/components/Museum.Clock'
import ClockAdvanced from '@/components/Museum.Clock.Advanced'
import Quiz from '@/components/Museum.Quiz'
import QuizAdvanced from '@/components/Museum.Quiz.Advanced'
import Birdcage from '@/components/Museum.Birdcage'
import BirdcageAdvanced from '@/components/Museum.Birdcage.Advanced'
import Map from '@/components/Museum.Map'
import MapAdvanced from '@/components/Museum.Map.Advanced'
import Zoltar from '@/components/Museum.Zoltar'
import ZoltarAdvanced from '@/components/Museum.Zoltar.Advanced'
import Cabinet from '@/components/Museum.Cabinet'
import CabinetAdvanced from '@/components/Museum.Cabinet.Advanced'

import Laser from '@/components/Museum.Laser'
import LaserAdvanced from '@/components/Museum.Laser.Advanced'
import Mausoleum from '@/components/Museum.Mausoleum'
import MausoleumAdvanced from '@/components/Museum.Mausoleum.Advanced'
import Mummy from '@/components/Museum.Mummy'
import MummyAdvanced from '@/components/Museum.Mummy.Advanced'
import Stairs from '@/components/Museum.Stairs'
import StairsAdvanced from '@/components/Museum.Stairs.Advanced'

import ResetDialog from '@/components/Museum.ResetDialog'

const DEVICE_TIMEOUT_SECONDS = 95

export default {
  data () {
    return {
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',
      advanced: {
        timer: false,
        hands: false,
        clock: false,
        quiz: false,
        bird: false,
        map: false,
        zoltar: false,
        cabinet: false,
        laser: false,
        mausoleum: false,
        mummy: false,
        stairs: false
      },
      status: [],
      showDetails: false,
      dialogStartConfirm: false,
      dialogReset: false,
      dialogResetConfirm: false,
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
    },
    largerDrawer: function() {
      return this.advanced.timer == true
    }
  },
  created () {
    this.operations =  this.$root.$data.museumOps

    // event handlers for children
    this.$root.$on('show-details', this.showAdvanced)
    this.$root.$on('close-details', this.hideAdvanced)
    this.$root.$on('reboot-device', this.showRebootDialog)
    this.$root.$on('close-reset-dialog', () => { this.dialogReset = false; })

    this.$root.$data.museumRoot.child('status').on('value', (snapshot) => {
        let status = snapshot.val()
        if (status == null) return

        let ds = {}
        for (const [name, device] of Object.entries(status)) {
          let connected = true
          let dev = status[name]
          let delta = (new Date()).getTime() - (new Date(dev.ping)).getTime()
          
          // TODO: fix daylight savings bug
          // if (delta > (DEVICE_TIMEOUT_SECONDS * 1000)) {
          //   connected = false
          // }

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
    },
    startRoom() {
      this.dialogStartConfirm = false
      this.$root.$data.museumRuns.create();
      this.$root.$data.museumRoot.child('devices/dashboard').update({ hours:"1", minutes:10, clue: -1, route: "home" })
    },
    triggerReboot() {
      this.operations.add({ command: `${this.dialogRebootDevice}.reboot` }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.showSnack('Device rebooted successfully.')
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
    'museum-timer': Timer,
    'museum-timer-advanced': TimerAdvanced,
    'museum-hands': Hands,
    'museum-hands-advanced': HandsAdvanced,
    'museum-clock': Clock,
    'museum-clock-advanced': ClockAdvanced,
    'museum-quiz': Quiz,
    'museum-quiz-advanced': QuizAdvanced,
    'museum-birdcage': Birdcage,
    'museum-birdcage-advanced': BirdcageAdvanced,
    'museum-map': Map,
    'museum-map-advanced': MapAdvanced,
    'museum-zoltar': Zoltar,
    'museum-zoltar-advanced': ZoltarAdvanced,
    'museum-cabinet': Cabinet,
    'museum-cabinet-advanced': CabinetAdvanced,

    'museum-laser': Laser,
    'museum-laser-advanced': LaserAdvanced,
    'museum-mausoleum': Mausoleum,
    'museum-mausoleum-advanced': MausoleumAdvanced,
    'museum-mummy': Mummy,
    'museum-mummy-advanced': MummyAdvanced,
    'museum-stairs': Stairs,
    'museum-stairs-advanced': StairsAdvanced,

    'museum-reset-dialog': ResetDialog
  }
}
</script>

<style scoped>
  .rightDrawer {
    z-index:1;
  }
  .largerDrawer {
    width: 350px !important;
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
  .secTitle {
    cursor:pointer;
    user-select: none;
  }
  .actionRow {
    padding-left:10px;
    padding-right: 10px;
    padding-top:0px;
    padding-bottom:10px;
  }
  .actionRow button {
    margin-top:0px;
    margin-bottom:0px;
  }
  .cardIcon {
   margin-bottom:3px;
    margin-left:7px;
    padding-right:10px;
  }
  .notConnected {
    color:red !important;
    padding-right: 0px;
  }
  .actionButton {
    margin-left:0px !important;
    margin-right: 4px !important;
    color: rgb(158,158,158) !important;
  }
  .status {
    display: flex;
  }
  .container {
    padding: 16px !important;
  }
  @media (max-width: 600px) {
    .hideIfNarrow {
      display: none !important;
    }
    .status {
      display: none;
    }
  }
  @media (max-width: 390px) {
    .hideIfReallyNarrow {
      display: none !important;
    }
  }
  
  .toolbar .toolbar__content>:not(.btn):not(.menu):first-child:not(:only-child),
  .toolbar .toolbar__extension>:not(.btn):not(.menu):first-child:not(:only-child) {
    margin-left: 10px !important;
  }


</style>

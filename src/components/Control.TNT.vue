<template>

  <v-flex>

    <!-- tnt card -->
    <v-card>
      <v-toolbar card>
        <v-toolbar-title>TNT</v-toolbar-title>
        <span class="spacer" />
        <v-btn flat small color="red lighten-3" @click.native="resetTntDiag = true">Reset</v-btn>
      </v-toolbar>

      <v-card-text class="grey lighten-3">
        <v-layout row wrap>
          <v-flex xs12 md6>
            <v-toolbar flat dense color="grey lighten-3">
              <v-toolbar-title class="mx-0"><a @click="refreshTimer()">Time</a></v-toolbar-title>
              <v-btn icon title="Set timer" @click.native="resetTimeDiag = true"><v-icon >snooze</v-icon></v-btn>
            </v-toolbar>

            <div style="font-size:34px;font-family: Monaco, monospace;margin-bottom:16px">
              {{formatTime(hours)}}:{{formatTime(minutes)}}:{{formatTime(seconds)}}
            </div>

            <div style="display:flex">
              <v-flex xs6>
                <div style="display:block">
                  <span>Key</span>
                  <div>
                  <v-btn 
                    id="keyLoading"
                    class="ma-0"
                    small dark color="accent"
                    :loading="keyLoading"
                    @click.native="confirmKeyDiag = true"
                    :disabled="keyLoading"
                    >
                    Trigger
                    <span slot="loader">Triggering...</span>
                  </v-btn>
                  </div>
                </div>
              </v-flex>
              <v-flex xs6>
                <div style="display:block">
                  <span>Wires</span>
                  <div>
                  <v-btn 
                    id="wireLoading"
                    class="ma-0"
                    small dark color="accent"
                    :loading="wireLoading"
                    @click.native="confirmWireDiag = true"
                    :disabled="wireLoading"
                    >
                    Trigger
                    <span slot="loader">Triggering...</span>
                  </v-btn>
                  </div>
                </div>
              </v-flex>
            </div>

            <div style="display:flex;margin-top:10px;">
              <v-flex xs6>
                <div style="display:block">
                  <span>Switch Errors</span>
                  <v-switch 
                    primary
                    :label="switchErrorLabel"
                    v-model="switchErrors"
                    @click.native="switchErrorsClicked"
                  ></v-switch>
                </div>
              </v-flex>
              <v-flex xs6>
                <div style="display:block">
                  <span>Wire Errors</span>
                  <v-switch 
                    primary
                    :label="wireErrorLabel"
                    v-model="wireErrors"
                    @click.native="wireErrorsClicked"
                  ></v-switch>
                </div>
              </v-flex>
            </div>

          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-card>
              <v-card-title>
                <h4><a @click="refreshState()">State</a></h4>
              </v-card-title>
              <v-divider></v-divider>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content :class="{ strikeIt: switchErrors }">Toggle 1:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <v-icon :style="{ color: iconColor(toggle1State) }">{{icon(toggle1State)}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content :class="{ strikeIt: switchErrors }">Toggle 2:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <v-icon :style="{ color: iconColor(toggle2State) }">{{icon(toggle2State)}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content :class="{ strikeIt: wireErrors }">Wire:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <v-icon :style="{ color: iconColor(wireState) }">{{icon(wireState)}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider/>
                <v-list-tile>
                  <v-list-tile-content>Key Solved:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <v-icon :style="{ color: iconColor(keySolvedState) }">{{icon(keySolvedState, 'key')}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>All Solved:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <v-icon :style="{ color: iconColor(allSolvedState) }">{{icon(allSolvedState, 'all')}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

            </v-card>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <!-- debug bar -->
    <div v-if="debugBar">
      <v-btn icon @click="timerEnabled = !timerEnabled"><v-icon >timer</v-icon></v-btn>
      <v-btn icon @click="tmpToggle"><v-icon >timeline</v-icon></v-btn>
      <v-btn icon @click="tmpLock()"><v-icon >lock</v-icon></v-btn>
      <v-btn icon @click="tmpAll()"><v-icon >cake</v-icon></v-btn>
    </div>

  </v-flex>

</template>

<script>
let STATE = {
  UNKNOWN: 1,
  OK: 2,
  BAD: 3
}
export default {
  data () {
    return {
      controlsRef: null,
      timerEnabled: false, // TODO: turn on when time/refresh is clicked
      debugBar: false,

      // dialogs
      confirmKeyDiag: false,
      confirmWireDiag: false,
      resetTimeDiag: false,
      resetTntDiag: false,
      setTime: {
        hour: null,
        minute: null,
        second: null
      },

      // snack stuff
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',

      // loading states
      keyLoading:false,
      wireLoading:false,

      // error toggles
      switchErrors: false,
      wireErrors: false,

      // device status states
      hours: 1,
      minutes: 11,
      seconds: 16,
      toggle1State: STATE.UNKNOWN,
      toggle2State: STATE.UNKNOWN,
      wireState: STATE.UNKNOWN,
      keySolvedState: STATE.UNKNOWN,
      allSolvedState: STATE.UNKNOWN

    }
  },

  computed: {
    switchErrorLabel: function () {
      return this.switchErrors ? 'Disabled' : 'Enabled'
    },
    wireErrorLabel: function () {
      return this.wireErrors ? 'Disabled' : 'Enabled'
    }
  },

  mounted() {
    this.controlsRef = this.$root.$data.fbdb.ref('control')

    // only show the debug bar if we have ?dbg or ?debug in the url
    if (this.$route.query.dbg !== undefined || this.$route.query.debug !== undefined) {
      this.debugBar = true;
    }

    setInterval(() => {
      if (!this.timerEnabled || (this.hours <= 0 && this.minutes <= 0 && this.seconds <= 0)) {
        return;
      }

      this.seconds--;
      if (this.seconds <= 0 && (this.minutes > 0 || this.hours > 0)) {

        this.seconds = 59;
        this.minutes--;

        if (this.minutes < 0 && this.hours > 0) {
          this.hours--;
          this.minutes = 59;
        }
      }
      
      if (this.seconds <= 0 && this.minutes <= 0 && this.hours <= 0) {
          // TODO: boom blink, sound, animation?
          console.log('boom!!!');
      }

    }, 1000);
  },

  methods: {
    icon: function(state, type) {
      // special case key
      if (type === 'key') {
        return state === STATE.OK ? 'done' : ''
      }

      // special case all
      if (type === 'all') {
        return state === STATE.OK ? 'done_all' : ''
      }

      if (state === STATE.OK) {
        return 'check_circle'
      } else if (state === STATE.BAD) {
        return 'error'
      } else {
        return ''
      }
    },
    iconColor: function(state) {
      if (state === STATE.OK) {
        return '#4CAF50'
      } else if (state === STATE.BAD) {
        return '#F44336'
      } else {
        return '#BDBDBD'
      }
    },

    refreshTimer() {
      // clear out times to indicate were loading
      this.hours = this.minutes = this.seconds = null;

      // TODO: write proper to db
      setTimeout(() => {
        this.hours = 1;
        this.minutes = 9;
        this.seconds = 22;
      }, 1200);
    },
    refreshState() {
      // clear out icons to indicate reloading
      this.toggle1State     =
        this.toggle2State   =
        this.wireState      =
        this.keySolvedState =
        this.allSolvedState = STATE.UNKNOWN;

      // TODO: write/query proper to db
      setTimeout(() => {
        this.toggle1State   = STATE.OK;
        this.toggle2State   = STATE.OK;
        this.wireState      = STATE.OK;
        this.keySolvedState = STATE.OK;
        this.allSolvedState = STATE.OK;
      }, 1200);
    },
    setTimer() {
      this.hours = this.setTime.hour;
      this.minutes = this.setTime.minute;
      this.seconds = this.setTime.second;

      this.resetTimeDiag = false;
    },

    triggerKey() {
      this.confirmKeyDiag = false;
      this.keyLoading = true;

      // TODO: remove when done demoing
      this.ledtoggle()

      // HACK: total hack to get around disabled styling.  don't have time to figure out proper
      let btn = document.getElementById('keyLoading');
      btn.id = 'disabled'

      // TODO: TMP: do the real work here
      setTimeout(() => {
         this.snackText = 'Key triggered successfully.';
         this.snackbar = true;
         this.keyLoading = false;
         btn.id = 'keyLoading'

      }, 3000)

    },
    triggerWire() {
      this.confirmWireDiag = false;
      this.wireLoading = true;

      // HACK: total hack to get around disabled styling.  don't have time to figure out proper
      let btn = document.getElementById('wireLoading');
      btn.id = 'disabled'

      // TODO: TMP: do the real work here
      setTimeout(() => {
         this.snackText = 'Wire error triggered successfully.';
         this.snackbar = true;
         this.wireLoading = false;
         btn.id = 'wireLoading'

      }, 3000)
    },
    triggerReset() {
      // TODO: actually issue the reset operation
      this.resetTntDiag = false;
    },

    switchErrorsClicked() {
    },
    wireErrorsClicked() {
    },

    formatTime(num) {
      if (!num || num === null) {
        return "--"
      }

      return ("0" + num).substr(-2,2);
    },

    // #######################################################
    // ## Debug Methods ######################################
    ledtoggle() {
      //    op: 'opt1' || 'opt2'
      this.controlsRef.push({
         op: 'led'
      });
    },
    tmpLock() {
      this.keySolvedState = STATE.OK
    },
    tmpToggle() {

      this.toggle1State = 
        this.toggle1State === STATE.UNKNOWN ? (Math.random()*101|0) % 2 == 0 ? STATE.OK : STATE.BAD : 
        this.toggle1State === STATE.OK ? STATE.BAD : STATE.OK;

      this.toggle2State = 
        this.toggle2State ===  STATE.UNKNOWN ? (Math.random()*101|0) % 2 == 0 ? STATE.OK : STATE.BAD : 
        this.toggle2State === STATE.OK ? STATE.BAD : STATE.OK;

      this.wireState = 
        this.wireState ===  STATE.UNKNOWN ? (Math.random()*101|0) % 2 == 0 ? STATE.OK : STATE.BAD : 
        this.wireState === STATE.OK ? STATE.BAD : STATE.OK;
    },
    tmpAll() {
      this.keySolvedState = STATE.OK
      this.allSolvedState = STATE.OK
    }
  }
}
</script>

<style scoped>
/* disable gui stepper in input box */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

table {
  margin: 0 auto;
}
td {
  font-size: 34px;
  font-family: Monaco, monospace;
}
td > input {
  width: 75px;
  height: 75px;
  font-size: 34px;
  font-family: Monaco, monospace;
  text-align: center;
  box-shadow: 0px 0px 18px rgba(0,0,0,0.2), 0 2px 18px 0 rgba(0,0,0,0.19) !important
}
#disabled {
  background:rgba(0,0,0,.12) !important;
  color: grey !important;
  font-size: 10px;
}
.strikeIt {
  text-decoration: line-through;
}
</style>

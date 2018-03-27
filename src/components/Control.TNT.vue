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

    <v-dialog v-model="confirmKeyDiag" max-width="410">
    <v-card>
      <v-card-title class="headline">Really trigger the key?</v-card-title>
      <v-card-text>Are you sure you want to trigger launching of the key from the device?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="confirmKeyDiag = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerKey">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="confirmWireDiag" max-width="410">
    <v-card>
      <v-card-title class="headline">Really trigger a wire error?</v-card-title>
      <v-card-text>Are you sure you want to trigger a wrong wire error on the device?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="confirmWireDiag = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerWire">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="resetTntDiag" max-width="410">
    <v-card>
      <v-card-title class="headline">Really reset the device?</v-card-title>
      <v-card-text>This will reboot the device and all current state lost.  Are you <i>sure</i> you want to do that?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="resetTntDiag = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerReset">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="resetTimeDiag" persistent max-width="360">
    <v-card>
      <v-card-title class="headline" style="padding-bottom:0px">Set new time</v-card-title>
      <v-card-text style="padding-top:5px">Enter new time to set timer to.</v-card-text>
      <v-card-text>
        <table>
          <tr>
            <td><input v-model="setTime.hour" maxlength="2" type='number' placeholder="HH" min="0" max="99" required></input></td>
            <td>:</td>
            <td><input v-model="setTime.minute" maxlength="2" type='number' placeholder="MM" min="0" max="59" required></input></td>
            <td>:</td>
            <td><input v-model="setTime.second" maxlength="2" type='number' placeholder="SS" min="0" max="59" required></input></td>
          </tr>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="resetTimeDiag = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="setTimer">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
      {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
  </v-snackbar>

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
      operationsRef: null,
      tntRef: null,
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
      timeLoaded: false,
      stateLoaded: false,

      // error toggles
      switchErrors: false,
      wireErrors: false,

      // device status states
      hours: null,
      minutes: null,
      seconds: null,
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
    this.operationsRef = this.$root.$data.fbdb.ref('operations')
    this.tntRef = this.$root.$data.fbdb.ref('tnt')
    
    let that = this;

    this.tntRef.child('time').on('value', function(snapshot) {
      let time = snapshot.val();
      if (time == null || !that.timeLoaded) return

      that.hours = time.hours;
      that.minutes = time.minutes;
      that.seconds = time.seconds;

      that.timerEnabled = true;
    });

    this.tntRef.child('state').on('value', function(snapshot) {
      let state = snapshot.val();
      if (state == null) return;
      if (!that.stateLoaded) {
        // ignore first load since it has stale data
        that.stateLoaded = true;
        return;
      }

        that.toggle1State   = state.toggle1;
        that.toggle2State   = state.toggle2;
        that.wireState      = state.wire;
        that.keySolvedState = state.keySolved;
        that.allSolvedState = state.allSolved;
    });

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

    // trigger time and state refreshes as if clicked
    // NOTE: might have to disable this when it goes live, depends on experience
    this.refreshTimer();
    this.refreshState();
  },

  methods: {
    icon: function(state, type) {
      let empty_icon = this.stateLoaded ? 'help' : '' // first load don't show any icons

      // special case key
      if (type === 'key') {
        return state === STATE.OK ? 'done' : empty_icon
      }

      // special case all
      if (type === 'all') {
        return state === STATE.OK ? 'done_all' : empty_icon
      }

      if (state === STATE.OK) {
        return 'check_circle'
      } else if (state === STATE.BAD) {
        return 'error'
      } else {
        return empty_icon
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
      this.timeLoaded = true;

      this.operationsRef.push({ command: 'refreshTime' });
    },
    refreshState() {
      // clear out icons to indicate reloading
      this.toggle1State     =
        this.toggle2State   =
        this.wireState      =
        this.keySolvedState =
        this.allSolvedState = STATE.UNKNOWN;

      this.operationsRef.push({ command: 'refreshState' });
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
      let that = this;

      // TODO: remove when done demoing
      // this.ledtoggle()

      // HACK: total hack to get around disabled styling.  don't have time to figure out proper
      let btn = document.getElementById('keyLoading');
      btn.id = 'disabled'

      this.operationsRef.push({ command: 'triggerKey' }).on("value", function(snapshot) {
        let command = snapshot.val()

        // check for received, that means pi registered it
        if (command.received) {

          // pop snack letting user know  we triggered it
          that.snackText = 'Key triggered successfully.';
          that.snackbar = true;
          that.keyLoading = false;
          btn.id = 'keyLoading'

          // disable further update notifications
          snapshot.ref.off()
        }
      });
    },
    triggerWire() {
      this.confirmWireDiag = false;
      this.wireLoading = true;
      let that = this;

      // HACK: total hack to get around disabled styling.  don't have time to figure out proper
      let btn = document.getElementById('wireLoading');
      btn.id = 'disabled'

      this.operationsRef.push({ command: 'triggerWire' }).on("value", function(snapshot) {
        let command = snapshot.val()

        // check for received, that means pi registered it
        if (command.received) {

          // pop snack letting user know  we triggered it
          that.snackText = 'Wire error triggered successfully.';
          that.snackbar = true;
          that.wireLoading = false;
          btn.id = 'wireLoading'

          // disable further update notifications
          snapshot.ref.off()
        }
      });
    },
    triggerReset() {
      let that = this;

      this.operationsRef.push({ command: 'triggerDeviceReset' }).on("value", function(snapshot) {
        
        if (snapshot.val().received) {
          // reset all internal state
          that.hours = that.minutes = that.seconds = null
          that.switchErrors = that.wireErrors = false
          that.toggle1State     =
            that.toggle2State   =
            that.wireState      = 
            that.keySolvedState = 
            that.allSolvedState = STATE.UNKNOWN

          that.snackText = 'Device reset successfully.';
          that.snackbar = true;
        }
      });

      this.resetTntDiag = false;
    },

    switchErrorsClicked() {
      let that = this;

      // TODO: should really be in state object, but requires more logic on arduino side
      // so for now we only look at 'true' and send an op for it since all I can do right now
      // is turn this on
      if (this.switchErrors) {
        this.operationsRef.push({ command: 'switchErrors' }).on("value", function(snapshot) {

          if (snapshot.val().received) {
            that.snackText = 'Switch errors disabled successfully.';
            that.snackbar = true;
          }
        });
      }
    },
    wireErrorsClicked() {
      let that = this;

      // TODO: same as switch errors, should be in state but requires arduino change
      if (this.wireErrors) {
        this.operationsRef.push({ command: 'wireErrors' }).on("value", function(snapshot) {

          if (snapshot.val().received) {
            that.snackText = 'Wire errors disabled successfully.';
            that.snackbar = true;
          }
        });
      }
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
      this.operationsRef.push({ command: 'led' });
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

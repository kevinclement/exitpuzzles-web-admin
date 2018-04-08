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

            <div style="display:flex;margin-bottom:15px">
              <v-flex xs6>
                <div style="display:block">
                  <span>Last Password</span>
                  <div style="font-size:18px;font-family: Monaco, monospace;">
                    <span :class='{ ip: !pass1valid }'>{{pass1}}</span>-<span :class='{ ip: !pass2valid }'>{{pass2}}</span>-<span :class='{ ip: !pass3valid }'>{{pass3}}</span>-<span :class='{ ip: !pass4valid }'>{{pass4}}</span>-<span :class='{ ip: !pass5valid }'>{{pass5}}</span>
                  </div>
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
                  <v-list-tile-content>Light:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <v-icon :style="{ color: '#FFC107' }">{{icon(lightState, 'light')}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>
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
                  <v-list-tile-content>All Solved: {{timeLeftSolved}}</v-list-tile-content>
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
  </v-flex>

</template>

<script>
let STATE = {
  UNKNOWN: 1,
  OK: 2,
  BAD: 3
}
export default {
  props: ['snack'],
  data () {
    return {
      tntRef: null,
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

      // loading states
      keyLoading:false,
      wireLoading:false,

      // error toggles
      switchErrors: false,
      wireErrors: false,

      // device status states
      hours: null,
      minutes: null,
      seconds: null,
      lightState: STATE.UNKNOWN,
      toggle1State: STATE.UNKNOWN,
      toggle2State: STATE.UNKNOWN,
      wireState: STATE.UNKNOWN,
      keySolvedState: STATE.UNKNOWN,
      allSolvedState: STATE.UNKNOWN,
      lastBadPassword: '',
      timeLeftSolved: '',
      timerTimeStamp: null,
      timeLeftInSeconds: 0
    }
  },

  computed: {
    timerEnabled: function() {
      return (this.hours !== null && this.minutes !== null && this.seconds !== null) && this.timeLeftInSeconds > 0
    },
    switchErrorLabel: function () {
      return this.switchErrors ? 'Disabled' : 'Enabled'
    },
    wireErrorLabel: function () {
      return this.wireErrors ? 'Disabled' : 'Enabled'
    },
    pass1: function() {
      let code = this.lastBadPassword.substring(0,1)
      return code === '' ? 'x' : code
    },
    pass2: function() {
      let code = this.lastBadPassword.substring(1,3)
      return code === '' ? 'xx' : code
    },
    pass3: function() {
      let code = this.lastBadPassword.substring(3,6)
      return code === '' ? 'xxx' : code
    },
    pass4: function() {
      let code = this.lastBadPassword.substring(6,10)
      return code === '' ? 'xxxx' : code
    },
    pass5: function() {
      let code =this.lastBadPassword.substring(10,15)
      return code === '' ? 'xxxxx' : code
    },
    pass1valid: function() {
      return this.pass1 === '4' || this.pass1 === 'x'
    },
    pass2valid: function() {
      return this.pass2 === '19' || this.pass2 === 'xx'
    },
    pass3valid: function() {
      return this.pass3 === '268' || this.pass3 === 'xxx'
    },
    pass4valid: function() {
      return this.pass4 === '0284' || this.pass4 === 'xxxx'
    },
    pass5valid: function() {
      return this.pass5 === '53464' || this.pass5 === 'xxxxx'
    }
  },

  watch: {
    timeLeftInSeconds: function(newTime) {
      this.timeFromSeconds(newTime)
    }
  },

  mounted() {
    this.operations = this.$root.$data.operations
    this.tntRef = this.$root.$data.fbdb.ref('tnt')

    this.tntRef.child('time').on('value', (snapshot) => {
      let time = snapshot.val();
      if (time == null) return

      // update might be partial, so fill out from our state
      let h = time.hours ? time.hours : this.hours
      let m = time.minutes ? time.minutes : this.minutes
      let s = time.seconds ? time.seconds : this.seconds
      let ts = time.timestamp ? time.timestamp : this.timerTimeStamp
      let elapsed = Math.floor(((new Date()).getTime() - ts) / 1000)

      this.timeLeftInSeconds = (h * 3600) + (m * 60) + s  - elapsed
      this.timerTimeStamp = ts;

      // TMP ###########################################
      let hours = Math.floor(elapsed / 3600);
      elapsed = elapsed - hours * 3600;
      let minutes = Math.floor(elapsed / 60);
      let seconds = elapsed - minutes * 60;

      console.log('total: ' + elapsed + ' => hours: ' + hours + ' minutes: ' + minutes + ' seconds: ' + seconds)
      // ###############################################

    });

    this.tntRef.child('state').on('value', (snapshot) => {
      let state = snapshot.val();
      if (state == null) return;

        this.lightState      = state.lightDetected ? STATE.OK : STATE.UNKNOWN;
        this.toggle1State    = state.toggle1;
        this.toggle2State    = state.toggle2;
        this.wireState       = state.wire;
        this.keySolvedState  = state.keySolved;
        this.allSolvedState  = state.allSolved;
        this.lastBadPassword = state.lastBadPassword;
        this.timeLeftSolved  = state.timeLeftSolved;
    });

    // only show the debug bar if we have ?dbg or ?debug in the url
    if (this.$route.query.dbg !== undefined || this.$route.query.debug !== undefined) {
      this.debugBar = true;
    }    

    setInterval(() => {
      // turn off timer if its been solved or our time is not positive
      if (!this.timerEnabled || this.allSolvedState === STATE.OK) {
        return;
      }

      this.timeLeftInSeconds--
    }, 1000);
  },

  methods: {
    timeFromSeconds: function(ts) {
      // if we ever go past time, just set it all to 0
      if (ts <= 0) {
        this.hours = this.minutes = this.seconds = 0
        return
      }

      // given time in seconds, split out hours, minutes, seconds
      let hours = Math.floor(ts / 3600);
      ts = ts - hours * 3600;
      let minutes = Math.floor(ts / 60);
      let seconds = ts - minutes * 60;

      //console.log('total: ' + ts + ' => hours: ' + hours + ' minutes: ' + minutes + ' seconds: ' + seconds)

      // set it on our state object to update the UI
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
    },
    icon: function(state, type) {
      // special case key
      if (type === 'key') {
        return state === STATE.OK ? 'done' : ''
      }

      // special case all
      if (type === 'all') {
        return state === STATE.OK ? 'done_all' : ''
      }

      // special case light
      if (type === 'light') {
        return state === STATE.OK ? 'lightbulb_outline' : ''
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

      this.operations.add({ command: 'refreshTime' })
    },
    refreshState() {
      // clear out icons to indicate reloading
      this.lightState       =
        this.toggle1State   =
        this.toggle2State   =
        this.wireState      =
        this.keySolvedState =
        this.allSolvedState = STATE.UNKNOWN;
      this.lastBadPassword = this.timeLeftSolved = ''

      this.operations.add({ command: 'refreshState' })
    },
    setTimer() {

      // clear it out to indicate server interaction
      this.resetTimeDiag = false;
      this.hours = this.minutes = this.seconds = null;

      this.operations.add({ 
        command: 'setTime',
        data: { hours: this.setTime.hour, minutes: this.setTime.minute, seconds: this.setTime.second } });
    },

    triggerKey() {
      this.confirmKeyDiag = false;
      this.keyLoading = true;

      // HACK: total hack to get around disabled styling.  don't have time to figure out proper
      let btn = document.getElementById('keyLoading');
      btn.id = 'disabled'

      this.operations.add({ command: 'triggerKey' }).on("value", (snapshot) => {
        let command = snapshot.val()

        // check for received, that means pi registered it
        if (command.received) {

          // pop snack letting user know  we triggered it
          this.snack('Key triggered successfully.')
          this.keyLoading = false
          btn.id = 'keyLoading'

          // disable further update notifications
          snapshot.ref.off()
        }
      });
    },
    triggerWire() {
      this.confirmWireDiag = false;
      this.wireLoading = true;

      // HACK: total hack to get around disabled styling.  don't have time to figure out proper
      let btn = document.getElementById('wireLoading');
      btn.id = 'disabled'

      this.operations.add({ command: 'triggerWire' }).on("value", (snapshot) => {
        let command = snapshot.val()

        // check for received, that means pi registered it
        if (command.received) {

          // pop snack letting user know  we triggered it
          this.snack('Wire error triggered successfully.')
          this.wireLoading = false;
          btn.id = 'wireLoading'

          // disable further update notifications
          snapshot.ref.off()
        }
      });
    },
    triggerReset() {
      this.operations.add({ command: 'triggerDeviceReset' }).on("value", (snapshot) => {

        if (snapshot.val().received) {
          // reset all internal state
          this.hours = this.minutes = this.seconds = null
          this.switchErrors = this.wireErrors = false
          this.lightState       =
            this.toggle1State   =
            this.toggle2State   =
            this.wireState      = 
            this.keySolvedState = 
            this.allSolvedState = STATE.UNKNOWN
          this.lastBadPassword = this.timeLeftSolved = ''

          this.snack('Device reset successfully.')
        }
      });

      this.resetTntDiag = false;
    },

    switchErrorsClicked() {
      // TODO: should really be in state object, but requires more logic on arduino side
      // so for now we only look at 'true' and send an op for it since all I can do right now
      // is turn this on
      if (this.switchErrors) {
        this.operations.add({ command: 'switchErrors' }).on("value", (snapshot) => {

          if (snapshot.val().received) {
            this.snack('Switch errors disabled successfully.')
          }
        });
      }
    },
    wireErrorsClicked() {
      // TODO: same as switch errors, should be in state but requires arduino change
      if (this.wireErrors) {
        this.operations.add({ command: 'wireErrors' }).on("value", (snapshot) => {

          if (snapshot.val().received) {
            this.snack('Wire errors disabled successfully.')
          }
        });
      }
    },

    formatTime(num) {
      if (num < 0 || num === null) {
        return "--"
      }

      return ("0" + num).substr(-2,2);
    },

    // #######################################################
    // ## Debug Methods ######################################
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
.ip {
  color:#EF5350
}
</style>

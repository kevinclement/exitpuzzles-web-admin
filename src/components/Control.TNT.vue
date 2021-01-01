<template>

  <v-flex>

    <!-- tnt card -->
    <v-card>
      <v-toolbar card>
        <v-toolbar-title>
          TNT
          <v-icon v-if="!isConnected" style="margin-bottom:4px;margin-left:7px;color:red" title="Device disconnected">report_problem</v-icon>
        </v-toolbar-title>
        <span class="spacer" />
        <v-btn flat small color="red lighten-3" @click.native="resetTntDiag = true">Reset</v-btn>
      </v-toolbar>

      <v-card-text class="grey lighten-3">
        <v-layout row wrap>
          <v-flex id="tntSection" xs12 md6>
            <v-toolbar flat dense color="grey lighten-3">
              <v-toolbar-title class="mx-0" style="margin-left: 0px !important;"><a @click="refreshTimer()">Time</a></v-toolbar-title>
              <v-btn icon title="Set timer" @click.native="resetTimeDiag = true"><v-icon >access_alarm</v-icon></v-btn>
            </v-toolbar>

            <div style="font-size:34px;font-family: Monaco, monospace;margin-bottom:16px">
              {{timer}}
            </div>
            
            <v-flex xs12>
                <div style="display:block">
                  <span>Actions</span>
                  <div>
                    <v-btn flat icon title="Shoot Key" class="actionBtn" @click.native="confirm('the key', 'launching of the key from', 'tnt.triggerKey', 'Key triggered')"><v-icon>vpn_key</v-icon></v-btn>
                    <v-btn flat icon title="Give Wire Error" class="actionBtn" @click.native="confirm('a wire error', 'a wrong wire error on', 'tnt.triggerWireError', 'Wire error triggered')"><v-icon>gesture</v-icon></v-btn>
                    <v-btn flat icon title="Force Win" class="actionBtn" @click.native="confirm('a win', 'a win for', 'tnt.solve', 'Win triggered')"><v-icon>emoji_events</v-icon></v-btn>

                    <v-btn flat icon title="Blink Display" class="actionBtn" @click.native="triggerBlink()"><v-icon>visibility</v-icon></v-btn>
                    <v-btn flat icon title="Give Door Code Verbally" class="actionBtn" @click.native="triggerBlink(true)"><v-icon>campaign</v-icon></v-btn>
                  </div>
                </div>
              </v-flex>

            <div style="display:flex;margin-top:10px;">
              <v-flex xs6>
                <div style="display:block">
                  <span>Switch Errors</span>
                  <v-switch 
                    primary
                    :label="switchErrorLabel"
                    v-model="switchErrors"
                    :disabled="!isConnected"
                    @click.native="switchErrorsClicked"
                    :hide-details="true"
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
                    :disabled="!isConnected"
                    :hide-details="true"
                    @click.native="wireErrorsClicked"
                  ></v-switch>
                </div>
              </v-flex>
            </div>
            <div style="display:flex;margin-top:0px;margin-bottom:15px">
              <v-flex xs6>
                <div style="display:block">
                  <span>Win Button</span>
                  <v-switch 
                    primary
                    :label="winButtonLabel"
                    v-model="winButton"
                    :disabled="!isConnected"
                    :hide-details="true"
                    @click.native="triggerWinButton"
                  ></v-switch>
                </div>
              </v-flex>
            </div>

            <div style="display:flex;margin-bottom:15px">
              <v-flex xs12>
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
                <h4>State</h4>
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
                <v-list-tile v-if="timeTaken">
                  <v-list-tile-content class="align-end">
                    Total Time: {{timeTaken}}
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

            </v-card>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really trigger {{dialogTitle}}?</v-card-title>
      <v-card-text>Are you sure you want to trigger {{dialogText}} the device?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="dialog = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="trigger">Yes</v-btn>
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
            <td><input v-model="setTime.hour" :class="{ invalidTime: !setTimeValid.hour.isvalid }" maxlength="2" type='number' placeholder="HH" min="0" max="99" required @change="validateTimer('hour')"></input></td>
            <td>:</td>
            <td><input v-model="setTime.minute" :class="{ invalidTime: !setTimeValid.minute.isvalid }" maxlength="2" type='number' placeholder="MM" min="0" max="59" required @change="validateTimer('minute')"></input></td>
            <td>:</td>
            <td><input v-model="setTime.second" :class="{ invalidTime: !setTimeValid.second.isvalid }" maxlength="2" type='number' placeholder="SS" min="0" max="59" required @change="validateTimer('second')"></input></td>
          </tr>
          <tr class="errorRow">
            <td><span v-if="!setTimeValid.hour.isvalid">{{setTimeValid.hour.msg}}</span></td>
            <td></td>
            <td><span v-if="!setTimeValid.minute.isvalid">{{setTimeValid.minute.msg}}</span></td>
            <td></td>
            <td><span v-if="!setTimeValid.second.isvalid">{{setTimeValid.second.msg}}</span></td>
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

      // dialogs
      dialog: false,
      dialogTitle: "a title",
      dialogText: "diag text",
      dialogTrigger: "tnt.xxx",
      dialogTriggerToast: "toast response",
      
      resetTimeDiag: false,
      resetTntDiag: false,
      setTime: {
        hour: null,
        minute: null,
        second: null
      },
      setTimeValid: {
        hour: { 
          isvalid: true,
          msg: ''
        },
        minute: { 
          isvalid: true,
          msg: ''
        },
        second: { 
          isvalid: true,
          msg: ''
        },
      },

      // device status states
      hours: null,
      minutes: null,
      seconds: null,
      lightState: STATE.UNKNOWN,
      toggle1State: STATE.UNKNOWN,
      toggle2State: STATE.UNKNOWN,
      wireState: STATE.UNKNOWN,
      keySolvedState: STATE.UNKNOWN,
      finished: false,
      switchErrors: false,
      wireErrors: false,
      winButton: false,
      password: 'xxxxxxxxxxxxxxx',
      timeLeftSolved: '',
      timerTimeStamp: null,
      timeLeftInSeconds: 0,
      isConnected: true,

      // TODO: remove
      allSolvedState: STATE.UNKNOWN,

      // last state snapshot
      lastStateSnapshot: null
    }
  },

  computed: {
    timer: function() {
      if (!this.isConnected) {
        return "--:--:--"
      }

      return this.formatTime(this.hours) + ':' + this.formatTime(this.minutes) + ':' + this.formatTime(this.seconds)
    },
    timerEnabled: function() {
      return (this.hours !== null && this.minutes !== null && this.seconds !== null) && this.timeLeftInSeconds > 0
    },
    switchErrorLabel: function () {
      return this.switchErrors ? 'Disabled' : 'Enabled'
    },
    wireErrorLabel: function () {
      return this.wireErrors ? 'Disabled' : 'Enabled'
    },
    winButtonLabel: function () {
      return this.winButton ? 'Disabled' : 'Enabled'
    },
    pass1: function() {
      if (this.password === '') return '#'

      let code = this.password.substring(0,1)
      return code === '' ? 'x' : code
    },
    pass2: function() {
      if (this.password === '') return '##'

      let code = this.password.substring(1,3)
      return code === '' ? 'xx' : code
    },
    pass3: function() {
      if (this.password === '') return '###'

      let code = this.password.substring(3,6)
      return code === '' ? 'xxx' : code
    },
    pass4: function() {
      if (this.password === '') return '####'

      let code = this.password.substring(6,10)
      return code === '' ? 'xxxx' : code
    },
    pass5: function() {
      if (this.password === '') return '#####'

      let code =this.password.substring(10,15)
      return code === '' ? 'xxxxx' : code
    },
    pass1valid: function() {
      return this.pass1 === '4' || this.pass1 === 'x' || this.pass1 === '#'
    },
    pass2valid: function() {
      return this.pass2 === '19' || this.pass2 === 'xx' || this.pass2 === '##'
    },
    pass3valid: function() {
      return this.pass3 === '268' || this.pass3 === 'xxx' || this.pass3 === '###'
    },
    pass4valid: function() {
      // HACK: total hack we have in place in bomb code currently to allow any digit in 1st character
      var hackpass4 = this.pass4.substring(1,4)

      return hackpass4 === '284' || this.pass4 === 'xxxx' || this.pass4 === '####'
    },
    pass5valid: function() {
      return this.pass5 === '53464' || this.pass5 === 'xxxxx' || this.pass5 === '#####'
    },
    timeTaken: function() {
      if (this.timeLeftSolved) {
        let totalTimeMinutes = 0;
        let totalTimeSeconds = 0;

        // split out parts 
        let parts = this.timeLeftSolved.split(':')

        // if I couldn't parse it, something funny, just don't show it
        if (parts.length !== 3) {
          console.log("WARN: weird format of time left, ignoring.  time left was " + this.timeLeftSolved)
          return ''
        }

        let hoursLeft = parseInt(parts[0])
        if (hoursLeft === 0) {
          totalTimeMinutes = 70
        } else {
          totalTimeMinutes = 10
        }

        let minutesLeft = parseInt(parts[1])
        totalTimeMinutes -= minutesLeft

        let secondsLeft = parseInt(parts[2])
        totalTimeSeconds -= secondsLeft

        if (secondsLeft !== 0) {
          totalTimeMinutes--
          totalTimeSeconds = 60 - secondsLeft
        }

        return totalTimeMinutes + " minutes, " + totalTimeSeconds + " seconds"
      }
      else {
        return ''
      }
    }
  },

  watch: {
    timeLeftInSeconds: function(newTime) {
      this.timeFromSeconds(newTime)
    },
  },

  mounted() {
    this.operations = this.$root.$data.operations
    this.tntRef = this.$root.$data.fbdb.ref('landlord/devices/tnt')

    this.tntRef.on('value', (snapshot) => {
      let tnt = snapshot.val()
      if (tnt == null) return
        
      this.isConnected     = tnt.info.isConnected

      this.lightState      = tnt.light ? STATE.OK : STATE.UNKNOWN

      // TODO: add other toggles
      // TODO: add other wires
      // TODO: implement
      //   this.timeLeftSolved  = state.timeLeftSolved

      this.toggle1State    = tnt.toggles.toggle1
      this.toggle2State    = tnt.toggles.toggle2
      this.wireState       = tnt.wires.wire4
      this.keySolvedState  = tnt.key
      this.finished        = tnt.finished
      this.password        = tnt.password
      
      // TODO: rename these to override
      this.switchErrors    = tnt.toggles.override
      this.wireErrors      = tnt.wires.override
      this.winButton       = tnt.overrideWinButton

        // update might be partial, so fill out from our state
      let h = tnt.time.hours ? tnt.time.hours : this.hours
      let m = tnt.time.minutes ? tnt.time.minutes : this.minutes
      let s = tnt.time.seconds ? tnt.time.seconds : this.seconds
      let ts = tnt.time.timestamp ? tnt.time.timestamp : this.timerTimeStamp
      let elapsed = Math.floor(((new Date()).getTime() - ts) / 1000)

      this.timeLeftInSeconds = (h * 3600) + (m * 60) + s - elapsed
      this.timerTimeStamp = ts
    });

    setInterval(() => {
      // turn off timer if its been solved or our time is not positive
      if (!this.timerEnabled || this.finished) {
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
      // if offline, dont show icons
      if (!this.isConnected) return ''

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

      this.operations.add({ command: 'tnt.refreshTime' })
    },

    validateTimer(section) {
      let valid = true

      // check hour
      if (!section || section === 'hour') {
        if (this.setTime.hour === null || this.setTime.hour === "") {
          this.setTimeValid.hour.isvalid = false
          this.setTimeValid.hour.msg = 'required'
          valid = false
        } else if (this.setTime.hour < 0 || this.setTime.hour >= 99) {
          this.setTimeValid.hour.isvalid = false
          this.setTimeValid.hour.msg = 'invalid'
          valid = false
        } else {
          this.setTimeValid.hour.isvalid = true
          this.setTimeValid.hour.msg = ''
        }
      }

      // check minute
      if (!section || section === 'minute') {
        if (this.setTime.minute === null || this.setTime.minute === "") {
          this.setTimeValid.minute.isvalid = false
          this.setTimeValid.minute.msg = 'required'
          valid = false
        } else if (this.setTime.minute < 0 || this.setTime.minute >= 60) {
          this.setTimeValid.minute.isvalid = false
          this.setTimeValid.minute.msg = 'invalid'
          valid = false
        } else {
          this.setTimeValid.minute.isvalid = true
          this.setTimeValid.minute.msg = ''
        }
      }

      // check seconds
      if (!section || section === 'second') {
        if (this.setTime.second === null || this.setTime.second === "") {
          this.setTimeValid.second.isvalid = false
          this.setTimeValid.second.msg = 'required'
          valid = false
        } else if (this.setTime.second < 0 || this.setTime.second >= 60) {
          this.setTimeValid.second.isvalid = false
          this.setTimeValid.second.msg = 'invalid'
          valid = false
        } else {
          this.setTimeValid.second.isvalid = true
          this.setTimeValid.second.msg = ''
        }
      }

      return valid
    },

    setTimer() {

      // check if valid
      if (!this.validateTimer()) {
        return
      }

      // clear it out to indicate server interaction
      this.resetTimeDiag = false;
      this.hours = this.minutes = this.seconds = null;

      this.operations.add({ 
         command: 'tnt.setTime',
         data: { hours: this.setTime.hour, minutes: this.setTime.minute, seconds: this.setTime.second } });
    },

    confirm(title, text, command, toastResp) {
      this.dialogTitle = title;
      this.dialogText = text;
      this.dialogTrigger = command;
      this.dialogTriggerToast = toastResp;
      this.dialog = true;
    },

    trigger() {
      this.dialog = false;
      this.operations.add({ command: this.dialogTrigger }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.snack(`${this.dialogTriggerToast} successfully.`)
        }
      });
    },

    triggerReset() {
      this.operations.add({ command: 'triggerDeviceReset' }).on("value", (snapshot) => {

        if (snapshot.val().received) {
          this.snack('Device reset successfully.')
        }
      });

      this.resetTntDiag = false;
    },
    triggerBlink(withCode) {
      
      let cmd = withCode ? 'tnt.triggerBlinkWithCode' : 'tnt.triggerBlink'
      let cmdTxt = withCode ? 'Door Code sent' : 'Blinked'

      this.operations.add({ command: cmd }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.snack(`${cmtTxt} successfully.`)
        }
      });
    },

    triggerWinButton() {
      this.operations.add({ command: 'triggerWinButton' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Win button toggled successfully.')
          }
      });
    },

    switchErrorsClicked() {
      if (this.switchErrors) {
        this.operations.add({ command: 'switchErrors' }).on("value", (snapshot) => {

          if (snapshot.val().received) {
            this.snack('Switch errors disabled successfully.')
          }
        });
      }
    },
    wireErrorsClicked() {
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
.errorRow > td {
  font-size:12px;
  color:red;
  padding-left:11px;
  padding-top:3px
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
.invalidTime {
  box-shadow: 0px 0px 18px rgba(0,0,0,0.2), 0 2px 18px 0 #E57373 !important
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

@media (min-width: 500px) {
  #tntSection {
    flex-basis:50%;
  }
}

.actionBtn {
  margin:0px; 
  padding:0px;
  margin-right: 4px !important;
  color: rgba(0,0,0,.7) !important;
}
</style>

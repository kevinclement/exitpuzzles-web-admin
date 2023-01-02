<template>

  <v-flex>
  
    <!-- tnt card -->
    <v-card>
      <v-toolbar card>
        <v-toolbar-title>
          🧨 TNT
          <v-icon v-if="!isConnected" style="margin-bottom:4px;margin-left:7px;color:red" title="Device disconnected">report_problem</v-icon>
        </v-toolbar-title>
        <span class="spacer" />
        <v-btn flat small color="red lighten-3" @click.native="resetTntDiag = true">Reset</v-btn>
      </v-toolbar>

      <v-card-text class="grey lighten-3">
        <v-layout row wrap>
          <v-flex id="tntSection" xs12 md6>
            <v-toolbar flat dense color="grey lighten-3">
              <v-toolbar-title class="mx-0" style="margin-left: 0px !important;margin-right:10px !important;"><a @click="refreshTimer()">Time</a></v-toolbar-title>
              <v-btn style="margin:0px;margin-right:4px;" icon title="Set timer" @click.native="popResetTimeDialog()"><v-icon >access_alarm</v-icon></v-btn>
              <v-btn style="margin:0px;margin-right:4px;" icon title="Set to a minute left" @click.native="setMinuteDialog=true"><v-icon >rotate_left</v-icon></v-btn>
              <v-btn style="margin:0px;margin-right:4px;" icon title="Add 30s" @click.native="triggerAddThirty()"><v-icon >forward_30</v-icon></v-btn>             
            </v-toolbar>

            <div style="font-size:34px;font-family: Monaco, monospace;margin-bottom:16px">
              {{timer}}
            </div>
            
            <!-- Actions -->
            <v-flex xs12>
                <div style="display:block">
                  <span>Actions</span>
                  <div>
                    <v-btn flat icon class="actionBtn" title="Shoot Key" 
                      @click.native="confirm('the key', 'launching of the key from', 'tnt.triggerKey', 'Key triggered')">
                      <v-icon>vpn_key</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" :title="`${keySolenoid ? 'Lower' : 'Raise'} Key`"
                      :class="{ solenoidEngaged: keySolenoid }"
                      @click.native="triggerKeySolenoid()">
                      <v-icon>{{keySolenoid ? "arrow_downward" : "arrow_upward" }}</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" :title="`${lockSolenoid ? 'Close' : 'Open'} Lock`"
                      :class="{ solenoidEngaged: lockSolenoid }"
                      @click.native="triggerLockSolenoid()">
                      <v-icon>{{lockSolenoid ? "arrow_back" : "arrow_forward" }}</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Give Wire Error"
                      @click.native="confirm('a wire error', 'a wrong wire error on', 'tnt.triggerWireError', 'Wire error triggered')">
                      <v-icon>gesture</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Force Win" 
                      @click.native="confirm('a win', 'a win for', 'tnt.solve', 'Win triggered')">
                      <v-icon>emoji_events</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Blink Display" 
                      @click.native="triggerBlink()">
                      <v-icon>visibility</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Give Door Code Verbally"
                      @click.native="triggerBlink(true)">
                      <v-icon>campaign</v-icon>
                    </v-btn>
                  </div>
                </div>
            </v-flex>

            <div style="display:flex;margin-top:10px;">
              <v-flex xs6>
                <div style="display:block">
                  <span>Toggle Errors</span>
                  <v-switch 
                    primary
                    :label="`${boolToString(toggleErrors)}`"
                    v-model="toggleErrors"
                    :disabled="!isConnected"
                    @click.native="toggleErrorsClicked"
                    :hide-details="true"
                  ></v-switch>
                </div>
              </v-flex>
              <v-flex xs6>
                <div style="display:block">
                  <span>Wire Errors</span>
                  <v-switch 
                    primary
                    :label="`${boolToString(!wires.override)}`"
                    v-model="!wires.override"
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
                    :label="`${boolToString(winButton)}`"
                    v-model="winButton"
                    :disabled="!isConnected"
                    :hide-details="true"
                    @click.native="triggerWinButton"
                  ></v-switch>
                </div>
              </v-flex>
              <v-flex xs6>
                <div style="display:block">
                  <span>Door Ajar</span>
                  <v-switch 
                    primary
                    :label="`${boolToString(doorAjarEnabled)}`"
                    v-model="doorAjarEnabled"
                    :disabled="!isConnected"
                    :hide-details="true"
                    @click.native="triggerDoorAjar"
                  ></v-switch>
                </div>
              </v-flex>
            </div>

            <div style="display:flex;margin-bottom:15px">
              <v-flex xs12>
                <div style="display:block">
                  <span>Last Password</span>
                  <div style="font-size:18px;font-family: Monaco, monospace;">
                    <span :class='{ ip: !passnValid("4", 1) }'>{{passn(1)}}</span>-<span :class='{ ip: !passnValid("19", 2) }'>{{passn(2)}}</span>-<span :class='{ ip: !passnValid("268", 3) }'>{{passn(3)}}</span>-<span :class='{ ip: !pass4valid }'>{{passn(4)}}</span>-<span :class='{ ip: !passnValid("53464", 5) }'>{{passn(5)}}</span>
                  </div>
                </div>
              </v-flex>
            </div>

          </v-flex>

          <!-- State -->
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
                    <v-icon :style="{ color: '#FFC107' }">{{light ? 'lightbulb_outline' : ''}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>
                
                <!-- Compass -->
                <v-list-tile>  
                  <v-list-tile-content>Compass:</v-list-tile-content>
                  <v-list-tile-content class="align-end" style="flex-direction: row; align-items: center;justify-content: flex-end;">
                    <span :class="{ lightDotOff: !compass.red    }" class="lightDot" style="background:#EF5350"/>
                    <span :class="{ lightDotOff: !compass.green  }" class="lightDot" style="background:#43A047"/>
                    <span :class="{ lightDotOff: !compass.blue   }" class="lightDot" style="background:#1E88E5"/>
                    <span :class="{ lightDotOff: !compass.yellow }" class="lightDot" style="background:#FFCA28"/>
                  </v-list-tile-content>
                </v-list-tile>

                <!-- Toggles -->
                <v-list-tile>  
                  <v-list-tile-content>Toggles:</v-list-tile-content>
                  <v-list-tile-content class="align-end" style="flex-direction: row; align-items: center;justify-content: flex-end;">
                    <span :class="{ toggleIncorrectPenalty:  toggles[0] }" class="toggleNumber">1</span>
                    <span :class="{ toggleIncorrect:        !toggles[1] }" class="toggleNumber">2</span>
                    <span :class="{ toggleIncorrect:        !toggles[2] }" class="toggleNumber">3</span>
                    <span :class="{ toggleIncorrectPenalty:  toggles[3] }" class="toggleNumber">4</span>
                    <span :class="{ toggleIncorrect:        !toggles[4] }" class="toggleNumber">5</span>
                  </v-list-tile-content>
                </v-list-tile>

                <!-- Wires -->
                <v-list-tile>  
                  <v-list-tile-content>Wires:</v-list-tile-content>
                  <v-list-tile-content class="align-end" style="flex-direction: row; align-items: center;justify-content: flex-end;">
                    <span class="wireNumber" :class="{ 
                        wireIncorrect:           wires.wire3 != 'A',
                        wireIncorrectDoorClosed: !solved.example && wires.wire3 != 'U' }">
                        A⇢{{wireDest(srcWires['A'])}}</span>
                    <span class="wireNumber" :class="{
                        wireIncorrect:           wires.wireD != 'B',
                        wireIncorrectDoorClosed: !solved.example && wires.wireD != 'U' }">
                        B⇢{{wireDest(srcWires['B'])}}</span>
                    <span :class="{ wireIncorrectPenalty:  wires.wire2 != 'C' }" class="wireNumber">C⇢{{wireDest(srcWires['C'])}}</span>
                    <span class="wireNumber" :class="{
                        wireIncorrect:           wires.wire4 != '1',
                        wireIncorrectDoorClosed: !solved.example && wires.wire4 != 'U' }">
                        1⇢{{wireDest(srcWires['1'])}}</span>
                    
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider/>

                <!-- Solved -->
                <v-list-tile>
                  <v-list-tile-content>Solved:</v-list-tile-content>
                  <v-list-tile-content class="align-end" style="flex-direction: row; align-items: center;justify-content: flex-end;">
                    <v-icon title="Left Door Open"         class="solvedIcon">{{solved.example  ? 'inventory_2': ''}}</v-icon>
                    <v-icon title="Toggles Solved"         class="solvedIcon">{{solved.toggles  ? 'toggle_on': ''}}</v-icon>
                    <v-icon title="Wires Solved"           class="solvedIcon">{{solved.wires    ? 'vpn_key': ''}}</v-icon>
                    <v-icon title="Password Solved"        class="solvedIcon">{{solved.all      ? 'apps': ''}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>All Solved: {{timeLeftSolved}}</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <v-icon style="color:#4CAF50;">{{ solved.all ? 'done_all': '' }}</v-icon>
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
  <v-dialog v-model="setMinuteDialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really set time to a minute left?</v-card-title>
      <v-card-text>Are you sure you want to change the time to a minute left?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="setMinuteDialog = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerSetToMinute()">Yes</v-btn>
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
export default {
  props: ['snack'],
  data () {
    return {
      tntRef: null,
      compassRef: null,

      // dialogs
      dialog: false,
      dialogTitle: "a title",
      dialogText: "diag text",
      dialogTrigger: "tnt.xxx",
      dialogTriggerToast: "toast response",
      resetTimeDiag: false,
      resetTntDiag: false,
      setMinuteDialog: false,

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
      light: false,
      
      toggles: [false,false,false,false,false],
      togglesFailing: false,
      toggleErrors: false,

      wires: {
            wireD: 'U',
            wire2: 'U',
            wire3: 'C', // default to passing
            wire4: 'U',

            failing: false,
            override: false
      },
      srcWires: {
        'A': 'U',
        'B': 'U',
        'C': 'U',
        '1': 'U'
      },

      finished: false,
      winButton: false,
      password: 'xxxxxxxxxxxxxxx',
      timeLeftSolved: '',
      timerTimeStamp: null,
      timeLeftInSeconds: 0,
      isConnected: true,
      doorAjarEnabled: false,

      deviceTntReset:false,
      deviceCompassReset: false,

      solved: {
        example: false,
        wires: false,
        toggles: false,
        all: false
      },

      keySolenoid: false,
      lockSolenoid: false,

      compass: {
        enabled: false,
        red: false,
        green: false,
        blue: false,
        yellow: false
      },
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

    pass4valid: function() {
      // HACK: total hack we have in place in bomb code currently to allow any digit in 1st character
      let pass4 = this.passn(4);
      var hackpass4 = pass4.substring(1,4)
      return hackpass4 === '284' || pass4 === 'xxxx' || pass4 === '####'
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
    this.compassRef = this.$root.$data.fbdb.ref('landlord/devices/compass')

    this.compassRef.on('value', (snapshot) => {
      let compass = snapshot.val()
      if (compass == null) return

      this.compass.enabled = compass.enabled;
      this.compass.red = compass.red;
      this.compass.green = compass.green;
      this.compass.blue = compass.blue;
      this.compass.yellow = compass.yellow;
    });

    this.tntRef.on('value', (snapshot) => {
      let tnt = snapshot.val()
      if (tnt == null) return
        
      this.isConnected  = tnt.info.isConnected
      this.light        = tnt.light

      this.toggles[0]     = tnt.toggles.toggle1;
      this.toggles[1]     = tnt.toggles.toggle2;
      this.toggles[2]     = tnt.toggles.toggle3;
      this.toggles[3]     = tnt.toggles.toggle4;
      this.toggles[4]     = tnt.toggles.toggle5;
      this.togglesFailing = tnt.toggles.failing;

      this.wires           = tnt.wires;
      
      // I have to reset them since I'm not sure they will show up
      // probably a better way to do this and not trigger something but it's late
      this.srcWires['A'] = this.srcWires['B'] = this.srcWires['C'] = this.srcWires['1'] = 'U';
      
      // wires come in with destination only, so reverse
      // so display is easier
      if (tnt.wires.wireD != 'U') {
        this.srcWires[tnt.wires.wireD] = 'D';
      }
      if (tnt.wires.wire2 != 'U') {
        this.srcWires[tnt.wires.wire2] = '2';
      }
      if (tnt.wires.wire3 != 'U') {
        this.srcWires[tnt.wires.wire3] = '3';
      }
      if (tnt.wires.wire4 != 'U') {
        this.srcWires[tnt.wires.wire4] = '4';
      }

      this.finished        = tnt.finished
      this.password        = tnt.password
      
      this.toggleErrors    = !tnt.toggles.override
      this.winButton       = !tnt.overrideWinButton
      this.doorAjarEnabled = !tnt.overrideDoorAjar

      this.solved.example  = tnt.exampleDoor
      this.solved.wires    = tnt.key
      this.solved.toggles  = !tnt.toggles.toggle1 &&
                              tnt.toggles.toggle2 &&
                              tnt.toggles.toggle3 &&
                             !tnt.toggles.toggle4 &&
                              tnt.toggles.toggle5
      this.solved.all      = tnt.solved
      this.timeLeftSolved  = tnt.timeLeftSolved

      this.keySolenoid = tnt.keySolenoid
      this.lockSolenoid = tnt.lockSolenoid
      
      // update might be partial, so fill out from our state
      let h = tnt.time.hours !== undefined ? tnt.time.hours : this.hours
      let m = tnt.time.minutes !== undefined ? tnt.time.minutes : this.minutes
      let s = tnt.time.seconds !== undefined ? tnt.time.seconds : this.seconds
      let ts = tnt.time.timestamp !== undefined ? tnt.time.timestamp : this.timerTimeStamp
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
    boolToString: function(b) {
      return b ? "Enabled" : "Disabled"
    },
    wireDest: function(w) {
      if (w != 'D' && w != '2' && w != '3' && w != '4') {
        return '';
      }
      else {
        return w;
      }
    },

    // this was a fun one to see if I could write
    // i'm proud of myself
    passn: function(n) 
    {
      if (this.password === '') {
        let str = ''
        for (let i=0; i<n; i++) {
          str += '#'
        }
        return str
      }

      let beg = 0;
      let ph = '';
      for(let i=0;i<n;i++) {
        beg += i;
        ph += 'x';
      }
      let end = beg + n;
      let code = this.password.substring(beg,end)

      return code === '' ? ph : code
    },
    passnValid: function(expected,n) {
      let p = this.passn(n);
      let expPH = '';
      let expPHX = '';
      for(let i=0;i<n;i++) {
        expPH += '#'
        expPHX += 'x'
      }

      return p === expected || p === expPH || p === expPHX
    },
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
    timeObjPadded(h,m,s) {
      return { hours: this.formatTime(h), minutes: this.formatTime(m), seconds: this.formatTime(s) }
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
         data: this.timeObjPadded(this.setTime.hour, this.setTime.minute, this.setTime.second ) });
    },

    popResetTimeDialog() {
      this.setTime.hour = this.formatTime(this.hours)
      this.setTime.minute = this.formatTime(this.minutes)
      this.setTime.second = this.formatTime(this.seconds)

      this.resetTimeDiag = true
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
      this.resetTntDiag = false;

      // track reset of both devices to confirm they did
      this.deviceTntReset = this.deviceCompassReset = false;

      this.operations.add({ command: 'tnt.reset' }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.deviceTntReset = true;
          if (!this.deviceTntReset && this.deviceCompassReset) {
            this.snack('Devices reset successfully.')
          }
        }
      });

      this.operations.add({ command: 'compass.reset' }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.deviceCompassReset = true;
          if (!this.deviceTntResetting && this.deviceTntReset) {
            this.snack('Devices reset successfully.')
          }
        }
      });
    },
    triggerSetToMinute() {
      this.setMinuteDialog = false;
      this.hours = this.minutes = this.seconds = null;
      this.operations.add({command: 'tnt.setTime', data: this.timeObjPadded(0,1,1) }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.snack(`Set to 01:01 successfully.`)
        }
      });
    },
    triggerAddThirty() {
      let h = this.hours;
      let m = this.minutes;
      let s = this.seconds + 30;

      // handle any overflow
      if (s >= 60) {
        s = s - 60;
        m++;
        if (m >= 60) {
          m = m - 60;
          h++;
        }
      }

      this.hours = this.minutes = this.seconds = null;
      this.operations.add({
        command: 'tnt.setTime',
        data: this.timeObjPadded(h,m,s)}).on("value", (snapshot) => 
      {
        if (snapshot.val().received) {
          this.snack(`Added 30s successfully.`)
        }
      });
    },
    triggerKeySolenoid() {
      let snackCmd = this.keySolenoid ? "lowered" : "raised"

      this.operations.add({
         command: 'tnt.triggerKeySolenoid',
         data: { enable: !this.keySolenoid } }).on("value", (snapshot) => 
      {
        if (snapshot.val().received) {
          this.snack(`Key solenoid ${snackCmd} successfully`)
        }
      })
    },
    triggerLockSolenoid() {
      let snackCmd = this.lockSolenoid ? "closed" : "opened"

      this.operations.add({
         command: 'tnt.triggerLockSolenoid',
         data: { enable: !this.lockSolenoid } }).on("value", (snapshot) => 
      {
        if (snapshot.val().received) {
          this.snack(`Lock ${snackCmd} successfully.`)
        }
      });
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
      this.operations.add({ command: 'tnt.toggleWinButton' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Win button toggled successfully.')
          }
      });
    },
    triggerDoorAjar() {
      let disabling = !this.doorAjarEnabled
      let cmd = disabling ? 'tnt.disableDoorAjarSensor' : 'tnt.enableDoorAjarSensor'
      this.operations.add({ command: cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack(`Door Ajar sensor ${disabling ? 'disabled' : 'enabled'} successfully.`)
          }
      });
    },

    toggleErrorsClicked() {
      this.operations.add({ command: 'tnt.toggleErrorsOverride' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Toggle override toggled successfully.')
          }
      });
    },
    wireErrorsClicked() {
      this.operations.add({ command: 'tnt.toggleWireErrorsOverride' }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.snack('Wire errors toggled successfully.')
        }
      });
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

.toggleNumber {
  border-radius: 20%;
  background: #4CAF50;
  height: 16px;
  width: 20px;
  margin: 2px;
  font-size:12px;
  line-height:16px;
  color: white;
  padding-left:6px;
}
.toggleIncorrect {
  background: #BDBDBD !important;
}
.toggleIncorrectPenalty {
  background: #F44336 !important;
}

.wireNumber {
  border-radius: 9%;
  background: #4CAF50;
  height: 16px;
  width: 40px;
  margin: 2px;
  font-size:12px;
  line-height:16px;
  color: white;
  padding-left:6px;
  padding-right:6px;
}
.wireIncorrect {
  background: #BDBDBD !important;
}
.wireIncorrectDoorClosed {
  background: #BDBDBD !important;
}
.wireIncorrectPenalty {
  background: #F44336 !important;
}
.passing {
  color: #4CAF50;
}
.failing {
  color: #F44336;
}

.lightDot {
  border-radius: 50%;
  height: 16px;
  width: 16px;
  margin: 2px;
}
.lightDotOff {
  background: #e0e0e0 !important;
}
.solvedIcon {
  padding-left: 2px;
}
.solenoidEngaged {
  color: #E53935 !important;
}
</style>

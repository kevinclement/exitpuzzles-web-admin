<template>
 <v-container fluid fill-height>
  <v-layout >
    <v-flex>
      <v-card>
        <v-toolbar card>
          <v-toolbar-title>TNT</v-toolbar-title>
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
                  <h4>State</h4>
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

      <div v-if="debugBar">
        <v-btn icon @click="timerEnabled = !timerEnabled"><v-icon >timer</v-icon></v-btn>
        <v-btn icon @click="tmpToggle"><v-icon >timeline</v-icon></v-btn>
        <v-btn icon @click="tmpLock()"><v-icon >lock</v-icon></v-btn>
        <v-btn icon @click="tmpAll()"><v-icon >cake</v-icon></v-btn>
      </div>
    </v-flex>
  </v-layout>
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

</v-container>
</template>

<script>
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
      toggle1State: null,
      toggle2State: null,
      wireState: null,
      keySolvedState: null,
      allSolvedState: null

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
        return state === 'ok' ? 'done' : ''
      }

      // special case all
      if (type === 'all') {
        return state === 'ok' ? 'done_all' : ''
      }

      if (state === 'ok') {
        return 'check_circle'
      } else if (state === 'bad') {
        return 'error'
      } else {
        return 'help'
      }
    },
    iconColor: function(state) {
      if (state === 'ok') {
        return '#4CAF50'
      } else if (state === 'bad') {
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
      this.keySolvedState = 'ok'
    },
    tmpToggle() {

      this.toggle1State = 
        this.toggle1State === null ? (Math.random()*101|0) % 2 == 0 ? 'ok' : 'bad' : 
        this.toggle1State === 'ok' ? 'bad' : 'ok';

      this.toggle2State = 
        this.toggle2State === null ? (Math.random()*101|0) % 2 == 0 ? 'ok' : 'bad' : 
        this.toggle2State === 'ok' ? 'bad' : 'ok';

      this.wireState = 
        this.wireState === null ? (Math.random()*101|0) % 2 == 0 ? 'ok' : 'bad' : 
        this.wireState === 'ok' ? 'bad' : 'ok';
    },
    tmpAll() {
      this.keySolvedState = 'ok'
      this.allSolvedState = 'ok'
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

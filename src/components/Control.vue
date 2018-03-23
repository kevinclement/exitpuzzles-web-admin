<template>
 <v-container fluid fill-height>

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
  <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
      {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
  </v-snackbar>

  <v-layout >
    <v-flex>
      <v-card>
        <v-toolbar card>
          <v-toolbar-title>TNT Status</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="grey lighten-3">
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-toolbar flat dense color="grey lighten-3">
                      <v-toolbar-title class="mx-0">Time</v-toolbar-title>
                      <v-btn icon style="" title="Refresh timer"><v-icon >update</v-icon></v-btn>
                      <v-btn icon style="" title="Set timer"><v-icon >snooze</v-icon></v-btn>
                    </v-toolbar>

                    <div style="font-size:34px;font-family: Monaco, monospace;margin-bottom:16px">
                      01:04:32
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

      <div>
        <v-btn icon><v-icon >timer</v-icon></v-btn>
        <v-btn icon @click="ledtoggle()"><v-icon >build</v-icon>1</v-btn>
        <v-btn icon><v-icon >build</v-icon>2</v-btn>
        <v-btn icon><v-icon >timeline</v-icon></v-btn>
        <v-btn icon @click="tmpclk()"><v-icon >lock</v-icon></v-btn>
        <v-btn icon @click="tmpclk2()"><v-icon >cake</v-icon></v-btn>
      </div>
    </v-flex>
  </v-layout>
</v-container>

</template>

<script>
export default {
  data () {
    return {
      controlsRef: null,

      // confirm dialog
      confirmKeyDiag: false,
      confirmWireDiag: false,

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

    // this.controlsRef.orderByChild('completed').equalTo(null).on("child_added", function(snapshot) {
    //   console.log('control: ' + snapshot.val().op)
    // });
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

    ledtoggle() {
      this.controlsRef.push({
         op: 'led'
      });
    },
    tmpclk() {
      this.controlsRef.push({
         op: 'opt1'
      });
    },
    tmpclk2() {
      this.controlsRef.push({
         op: 'opt2'
      });
    },
    triggerKey() {
      this.confirmKeyDiag = false;
      this.keyLoading = true;

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
    }

  }
}
</script>

<style scoped>
#disabled {
  background:rgba(0,0,0,.12) !important;
  color: grey !important;
  font-size: 10px;
}
.strikeIt {
  text-decoration: line-through;
}
</style>

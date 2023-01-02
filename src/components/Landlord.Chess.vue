<template>

  <v-flex>
  
    <!-- chess card -->
    <v-card class="chessCard">
      <v-toolbar card>
        <v-toolbar-title>
          ♟️ Chess | Mailbox
          <v-icon v-if="!isConnected" style="margin-bottom:4px;margin-left:7px;color:red" title="Device disconnected">report_problem</v-icon>
        </v-toolbar-title>
        <span class="spacer" />
        <v-btn flat small color="red lighten-3" @click.native="resetChessDiag = true">Reset</v-btn>
      </v-toolbar>

      <v-card-text class="grey lighten-3">
        <v-layout row wrap>
          <v-flex id="chessSection" xs12 md6>
            
            <!-- Actions -->
            <v-flex xs12>
                <div style="display:block">
                  <span>Actions</span>
                  <div>
                    <v-btn flat icon class="actionBtn" title="Drop mail"
                      @click.native="triggerDropMail()">
                      <v-icon>markunread_mailbox</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Reset Mailbox"
                      @click.native="triggerMailboxReset()">
                      <v-icon>restart_alt</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Solve Chess Head"
                      @click.native="triggerChessSolveHead()">
                      <v-icon>psychology</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Solve Chess Board"
                      @click.native="triggerChessSolveBoard()">
                      <v-icon>grid_on</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Reset Chess"
                      @click.native="triggerChessReset()">
                      <v-icon>restart_alt </v-icon>
                    </v-btn>
                  </div>
                </div>
            </v-flex>

            <div style="display:flex;margin-top:10px;">
              <v-flex xs6>
                <div style="display:block">
                  <span>Toggle Foo</span>
                  <!-- <v-switch 
                    primary
                    :label="`${boolToString(toggleErrors)}`"
                    v-model="toggleErrors"
                    :disabled="!isConnected"
                    @click.native="toggleErrorsClicked"
                    :hide-details="true"
                  ></v-switch> -->
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
                    <!-- <v-icon :style="{ color: '#FFC107' }">{{light ? 'lightbulb_outline' : ''}}</v-icon> -->
                  </v-list-tile-content>
                </v-list-tile>
                
                <v-list-tile>  
                  <v-list-tile-content>Compass:</v-list-tile-content>
                  <!-- <v-list-tile-content class="align-end" style="flex-direction: row; align-items: center;justify-content: flex-end;">
                    <span :class="{ lightDotOff: !compass.red    }" class="lightDot" style="background:#EF5350"/>
                    <span :class="{ lightDotOff: !compass.green  }" class="lightDot" style="background:#43A047"/>
                    <span :class="{ lightDotOff: !compass.blue   }" class="lightDot" style="background:#1E88E5"/>
                    <span :class="{ lightDotOff: !compass.yellow }" class="lightDot" style="background:#FFCA28"/>
                  </v-list-tile-content> -->
                </v-list-tile>

                <v-divider/>

                <!-- Solved -->
                <v-list-tile>
                  <v-list-tile-content>Solved:</v-list-tile-content>
                  <v-list-tile-content class="align-end" style="flex-direction: row; align-items: center;justify-content: flex-end;">
                    <!-- <v-icon title="Left Door Open"         class="solvedIcon">{{solved.example  ? 'inventory_2': ''}}</v-icon>
                    <v-icon title="Toggles Solved"         class="solvedIcon">{{solved.toggles  ? 'toggle_on': ''}}</v-icon>
                    <v-icon title="Wires Solved"           class="solvedIcon">{{solved.wires    ? 'vpn_key': ''}}</v-icon>
                    <v-icon title="Password Solved"        class="solvedIcon">{{solved.all      ? 'apps': ''}}</v-icon> -->
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
  
  <v-dialog v-model="resetChessDiag" max-width="410">
    <v-card>
      <v-card-title class="headline">Really reset the device?</v-card-title>
      <v-card-text>This will reboot the device and all current state lost.  Are you <i>sure</i> you want to do that?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="resetChessDiag = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerReset">Yes</v-btn>
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
      chessRef: null,

      // dialogs
      dialog: false,
      dialogTitle: "a title",
      dialogText: "diag text",
      dialogTrigger: "chess.xxx",
      dialogTriggerToast: "toast response",
      resetChessDiag: false,

      // device status states
      bust: false,
      bust_solved: false,
      piece_1: false,
      piece_2: false,
      rfid_solved: false,
      solved: false,

      isConnected: true,
    }
  },

  computed: {
  },

  watch: {
  },

  mounted() {
    this.operations = this.$root.$data.operations
    this.chessRef = this.$root.$data.fbdb.ref('landlord/devices/chess')

    this.chessRef.on('value', (snapshot) => {
      let chess = snapshot.val()
      if (chess == null) return

      this.bust = chess.bust;
      this.bust_solved = chess.bust_solved;
      this.piece_1 = chess.piece_1;
      this.piece_2 = chess.piece_2;
      this.rfid_solved = chess.rfid_solved;
      this.solved = chess.solved;
    });
  },

  methods: {
    boolToString: function(b) {
      return b ? "Enabled" : "Disabled"
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
      this.resetChessDiag = false;

      this.operations.add({ command: 'chess.reset' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Chess reset triggered successfully.')
          }
      });
    },

    triggerDropMail() {
      this.operations.add({ command: 'mailbox.drop' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Dropped mail successfully.')
          }
      });
    },

    triggerMailboxReset() {
      this.operations.add({ command: 'mailbox.reboot' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Mailbox reset triggered successfully.')
          }
      });
    },

    triggerSolveHead() {
      this.operations.add({ command: 'chess.solveHead' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Chess solve head triggered successfully.')
          }
      });
    },

    triggerSolveBoard() {
      this.operations.add({ command: 'chess.solveBoard' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Chess solve board triggered successfully.')
          }
      });
    },

  }
}
</script>

<style scoped>
.chessCard {
  margin-top: 30px;
}

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
  #chessSection {
    flex-basis:50%;
  }
}

.actionBtn {
  margin:0px; 
  padding:0px;
  margin-right: 4px !important;
  color: rgba(0,0,0,.7) !important;
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

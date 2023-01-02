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
                      @click.native="confirm('dropping mail', 'dropping mail', 'mailbox.drop', 'Mail dropped')">
                      <v-icon>markunread_mailbox</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Solve bust" 
                      @click.native="confirm('solving the bust', 'solving the bust', 'chess.solveHead', 'Bust solved')">
                      <v-icon>psychology</v-icon>
                    </v-btn>
                    <v-btn flat icon class="actionBtn" title="Solve board" 
                      @click.native="confirm('solving the board', 'solving the board', 'chess.solveBoard', 'Board solved')">
                      <v-icon>grid_on</v-icon>
                    </v-btn>
                  </div>
                </div>
            </v-flex>

            <div style="display:flex;margin-top:10px;">
              <v-flex xs6>
                <div style="display:block">
                  <span>Lights</span>
                  <v-switch 
                    primary
                    :label="`${boolToOnOff(chess.lights)}`"
                    v-model="chess.lights"
                    :disabled="!chess.lights"
                    @click.native="toggleLightsClicked"
                    :hide-details="true"
                  ></v-switch>
                </div>
              </v-flex>
              <v-flex xs6>
                <div style="display:block">
                  <span>Pieces</span>
                  <v-switch 
                    primary
                    :label="`${boolToString(!chess.piecesDisabled)}`"
                    v-model="!chess.piecesDisabled"
                    :disabled="!isConnected"
                    :hide-details="true"
                    @click.native="togglePiecesClicked"
                  ></v-switch>
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
                  <v-list-tile-content>Bust:</v-list-tile-content>
                  <v-list-tile-content class="align-end" style="flex-direction: row; align-items: center;justify-content: flex-end;">
                    <span :class="{ lightDotOff: !chess.bust }" class="lightDot" style="background:#66BB6A"/>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Pieces:</v-list-tile-content>
                  <v-list-tile-content class="align-end" style="font-size:32px;">
                    {{ chess.piece_1 ? '♔' : '' }}
                    {{ chess.piece_2 ? '♛' : '' }} 
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Solved:</v-list-tile-content>
                  <v-list-tile-content class="align-end" style="flex-direction: row; align-items: center;justify-content: flex-end;">
                    <v-icon title="Bust Solved"  class="solvedIcon">{{chess.bust_solved  ? 'psychology': ''}}</v-icon>
                    <v-icon title="Chess Pieces Solved"  class="solvedIcon">{{chess.rfid_solved  ? 'grid_on': ''}}</v-icon>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider/>

                <v-list-tile>
                  <v-list-tile-content>Vacuum:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <v-icon :style="[!mailbox.vacuum ? {'color': '#F5F5F5'} : '']">outlet</v-icon>          
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Mailbox:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    {{ prettyMailboxState() }}
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
      <v-card-text>Are you sure you want to trigger {{dialogText}}?</v-card-text>
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
      mailboxRef: null,

      // dialogs
      dialog: false,
      dialogTitle: "a title",
      dialogText: "diag text",
      dialogTrigger: "chess.xxx",
      dialogTriggerToast: "toast response",
      resetChessDiag: false,

      // reset states
      deviceChessReset: false,
      deviceMailboxReset: false,

      // device status states
      chess: {
        bust: false,
        bust_solved: false,
        piece_1: false,
        piece_2: false,
        rfid_solved: false,
        lights: false,
        piecesDisabled: false,
        solved: false,
      },
      mailbox: {
        vacuum: false,
        state: "UNKNOWN",
      },

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
    this.mailboxRef = this.$root.$data.fbdb.ref('landlord/devices/mailbox')

    this.chessRef.on('value', (snapshot) => {
      let chess = snapshot.val()
      if (chess == null) return

      this.chess.bust = chess.bust;
      this.chess.bust_solved = chess.bust_solved;
      this.chess.piece_1 = chess.piece_1;
      this.chess.piece_2 = chess.piece_2;
      this.chess.rfid_solved = chess.rfid_solved;
      this.chess.lights = chess.lights;
      this.chess.piecesDisabled = chess.piecesDisabled;
      this.chess.solved = chess.solved;
    });

    this.mailboxRef.on('value', (snapshot) => {
      let mailbox = snapshot.val()
      if (mailbox == null) return

      this.mailbox.vacuum = mailbox.vacuum;
      this.mailbox.state = mailbox.state;
    });

  },

  methods: {
    boolToString: function(b) {
      return b ? "Enabled" : "Disabled"
    },

    boolToOnOff: function(b) {
      return b ? "ON" : "OFF"
    },

    prettyMailboxState() {
      let txt = ""
      switch(this.mailbox.state) {
        case "WAITING":
          txt = "READY"
          break;
        case "STARTING":
          txt = "VACUUM"
          break;
        case "DROPPING":
          txt = "DROPPING"
          break;
        case "SETTLING":
          txt = "WAITING"
          break;
        case "DONE":
          txt = "DONE"
          break;
        default:
          txt = this.mailbox.state
      }
      return txt
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

      // track reset of both devices to confirm they did
      this.deviceChessReset = this.deviceMailboxReset = false;

      this.operations.add({ command: 'chess.reset' }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.deviceChessReset = true;
          if (this.deviceMailboxReset) {
            this.snack('Devices reset successfully.')
          }
        }
      });

      this.operations.add({ command: 'mailbox.reset' }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.deviceMailboxReset = true;
          if (this.deviceChessReset) {
            this.snack('Devices reset successfully.')
          }
        }
      });
    },

    toggleLightsClicked() {
      // Should only trigger for on->off override
      if (!this.chess.lights) {
        this.operations.add({ command: 'chess.lightsOff' }).on("value", (snapshot) => {
            if (snapshot.val().received) {
              this.snack('Lights turned off successfully.')
            }
        });
      }
    },

    togglePiecesClicked() {
      let cmd = !this.chess.piecesDisabled ? "chess.piecesOff" : "chess.piecesOn"
      let resTxt = !this.chess.piecesDisabled ? "off" : "on"
      
      this.operations.add({ command: cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack(`Pieces turned ${resTxt} successfully.`)
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

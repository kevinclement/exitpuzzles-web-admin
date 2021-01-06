<template>
<v-flex>
  <!-- painting -->
  <v-card class="paintingCard">
    <v-toolbar card>
      <v-toolbar-title>Painting
        <v-icon v-if="!isConnected" class="notConnected" title="Device disconnected">report_problem</v-icon>
        <v-icon v-if="isEnabled" class="isEnabled" title="Light detected">wb_incandescent</v-icon>
      </v-toolbar-title>
      <span class="spacer" />
    </v-toolbar>

    <v-card-text class="grey lighten-3">
      <div style="display: flex;flex-flow: row wrap;">
        <div style="padding-top: 10px;">
          <v-btn 
            class="ma-0"
            small dark color="accent"
            @click.native="confirmDrop = true">Drop
          </v-btn>
          <v-btn 
            class="ma-0"
            small dark color="accent"
            @click.native="triggerGetStatus()">Status
          </v-btn>
        </div>
        <div style="flex-grow:1;text-align:right;padding-top: 10px;">

          <v-btn 
            class="ma-0"
            small dark :color="enableDisableColor"
            @click.native="toggleEnable()">{{enableDisableText}}
          </v-btn>

        </div>
      </div>

      <v-radio-group 
        v-model="manualModeUI"
        label="Magnet"
        :hide-details="true"
        >
        <v-radio
          v-for="opt in manualModeOptions"
          :key="opt.value"
          :label="`${opt.label}`"
          :value="opt.value"
          @click.native="confirmManModeChange"
        ></v-radio>
      </v-radio-group>

      <v-text-field 
        class="threshold"
        :hide-details="true"
        maxlength="16"
        label="Threshold"
        type="number"
        v-model="threshold"
        v-on:keyup.enter="thresholdSend"></v-text-field>

      <v-text-field
        class="wait"
        :hide-details="true"
        maxlength="16"
        label="Wait"
        type="number"
        v-model="wait"
        v-on:keyup.enter="waitSend"></v-text-field>
                  
     <div><a v-on:click.stop="resetDefault">reset default</a></div>

    </v-card-text>
  </v-card>

  <v-dialog v-model="confirmDrop" max-width="410">
    <v-card>
      <v-card-title class="headline">Really drop the key?</v-card-title>
      <v-card-text>Are you sure you want to trigger dropping of the key from the device?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="confirmDrop = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerDrop">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="confirmManual" max-width="410">
    <v-card>
      <v-card-title class="headline">Really change the manual mode?</v-card-title>
      <v-card-text>Are you sure you want to change the manual mode?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="triggerManualRevert">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerManual">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
</v-flex>
</template>

<script>
  export default {
    props: ['snack'],
    data: () => ({
      isConnected: true,
      isEnabled: false,
      threshold: 0,
      manualModeDB: -1,
      manualModeUI: -1,
      wait: 0,
      confirmDrop: false,
      confirmManual: false,
      manualModeOptions: [
        { label:"Auto", value:2 },
        { label:"Always On", value:1 },
        { label:"Always Off", value:0, },
      ],
    }),
    computed: {
      enableDisableText: function() {
        return this.isEnabled ? "Disable" : "Enable";
      },
      enableDisableColor: function() {
        return this.isEnabled ? "red lighten-1" : "green lighten-1";
      }
    },
    created () {
      this.operations = this.$root.$data.operations

      this.$root.$data.fbdb.ref('landlord/devices/painting').on('value', (snapshot) => {
        let painting = snapshot.val()
        if (painting == null) return

        this.isConnected = painting.info.isConnected;
        this.threshold = painting.threshold;
        this.wait = painting.wait;
        this.isEnabled = painting.enabled;
        this.manualModeDB = painting.manualMode;
        this.manualModeUI = painting.manualMode;
      })
    },
    methods: {
      confirmManModeChange() {
        this.confirmManual = true
      },
      resetDefault() {
        this.threshold = 100
        this.wait = 1000
      },
      toggleEnable() {        
        this.operations.add({ command: 'paint.setEnabled' , data: { enabled: !this.isEnabled } }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            let snackStr = !this.isEnabled ? 'Succesfully enabled.' : 'Succesfully disabled.'
            this.snack(snackStr)
          }
        });
      },
      triggerManual() {
        this.confirmManual = false
        this.manualModeDB = this.manualModeUI
        
        this.operations.add({ command: 'paint.setManual' , data: { manual: this.manualModeUI } }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            let modeStr = this.manualModeUI == 0 ? 'Turned magnet off permanently' : 
                          this.manualModeUI == 1 ? 'Turned magnet on permanently' : 
                                                   'Turned on Automatic mode'
            this.snack(modeStr)
          }
        });
      },
      triggerManualRevert() {
        this.confirmManual = false
        this.manualModeUI = this.manualModeDB
      },
      triggerDrop() {
        this.confirmDrop = false

        this.operations.add({ command: 'paint.drop' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Dropped successfully.')
          }
        });
      },
      triggerGetStatus() {
        this.operations.add({ command: 'paint.getStatus' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Get status successfull.')
          }
        });
      },
      thresholdSend() {
        this.operations.add({ command: 'paint.setThreshold', data: { threshold: this.threshold } }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Set device threshold successfully.')
          }
        });
      },
      waitSend() {
        this.operations.add({ command: 'paint.setWait', data: { wait: this.wait } }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Set wait time successfully.')
          }
        });
      },
    }
  }
</script>

<style scoped>
.paintingCard {
  margin-top: 30px;
}
.notConnected {
  margin-bottom:4px;
  margin-left:7px;
  color:red !important;
}
.isEnabled {
  margin-bottom:4px;
  margin-left:7px;
  color:#FFC107 !important;
}
.dropBtn {
  display:inline-block;
  vertical-align:top;
  padding-top:13px;
  padding-right:20px;
}
.threshold {
  display:inline-block;
  width:100px;
  padding-right: 20px;
}
.wait {
  width:100px;
  display:inline-block;
}
</style>

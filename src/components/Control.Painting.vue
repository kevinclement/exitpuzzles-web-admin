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
            small dark color="accent"
            @click.native="toggleEnable()">{{enableDisableText}}
          </v-btn>

        </div>
      </div>

      <v-radio-group 
        v-model="manualMode"
        label="Magnet"
        change="mmChange"
        :hide-details="true"
        >
        <v-radio
          v-for="opt in manualModeOptions"
          :key="opt.value"
          :label="`${opt.label}`"
          :value="opt.value"
          change="mmChange"
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
</v-flex>
</template>

<script>
  export default {
    props: ['snack'],
    data: () => ({
      confirmDiag: false,
      isConnected: true,
      isEnabled: false,
      threshold: 0,
      manualMode: -1,
      wait: 0,
      confirmDrop: false,
      manualModeOptions: [
        { label:"Auto", value:2 },
        { label:"Always On", value:1 },
        { label:"Always Off", value:0, },
      ],
    }),
    watch: {
      manualMode: function(val, old) { 
      }
    },
    computed: {
      enableDisableText: function() {
        return this.isEnabled ? "Disable" : "Enable";
      }
    },
    created () {
      this.operations = this.$root.$data.operations

      this.$root.$data.fbdb.ref('painting').on('value', (snapshot) => {
        let painting = snapshot.val()
        if (painting == null) return

        this.isConnected = painting.isConnected;
        this.threshold = painting.threshold;
        this.wait = painting.wait;
        this.isEnabled = painting.enabled;
        this.manualMode = painting.manualMode;
      })
    },
    methods: {
      resetDefault() {
        this.threshold = 100;
        this.wait = 1000;
      },
      triggerDrop() {
        this.confirmDrop = false;

        this.operations.add({ command: 'paint.drop' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Dropped successfully.')
          }
        });
      },

      triggerGetStatus() {
        this.operations.add({ command: 'paint.get.status' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Get status successfull.')
          }
        });
      },

      setManualModeToOff() {
        this.operations.add({ command: 'paint.set.manual' , data: { manual: 0 } }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Set manual mode to \'off\'.')
          }
        });
      },

      setManualModeToOn() {
        this.operations.add({ command: 'paint.set.manual' , data: { manual: 1 } }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Set manual mode to \'on\'.')
          }
        });
      },

      setManualModeToAuto() {
        this.operations.add({ command: 'paint.set.manual' , data: { manual: 2 } }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Set manual mode to \'auto\'.')
          }
        });
      },

      thresholdSend() {
        this.operations.add({ command: 'paint.set.threshold', data: { threshold: this.threshold } }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Set device threshold successfully.')
          }
        });
      },

      waitSend() {
        this.operations.add({ command: 'paint.set.wait', data: { wait: this.wait } }).on("value", (snapshot) => {
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

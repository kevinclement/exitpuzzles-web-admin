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
      <v-layout row wrap>

              <v-flex style="padding-right:0px;flex-grow:0" xs12>
                    <v-btn 
                      class="ma-0"
                      small dark color="accent"
                      @click.native="triggerDrop()">Drop
                    </v-btn>

                    <v-btn 
                      class="ma-0"
                      small dark color="accent"
                      @click.native="triggerGetStatus()">Status
                    </v-btn>

                    <v-btn 
                      class="ma-0"
                      small dark color="accent"
                      @click.native="setManualModeToEnabled()">Off
                    </v-btn>

                    <v-btn 
                      class="ma-0"
                      small dark color="accent"
                      @click.native="setManualModeToDisabled()">On
                    </v-btn>

                    <v-btn 
                      class="ma-0"
                      small dark color="accent"
                      @click.native="turnManualModeOff()">Auto
                    </v-btn>
                    
              </v-flex>            

              <v-flex style="padding-right:0px;flex-grow:0" xs12>
                <v-text-field 
                  class="threshold"
                  :hide-details="true"
                  maxlength="16"
                  label="Threshold"
                  v-model="threshold"
                  v-on:keyup.enter="thresholdSend"></v-text-field>

                  <v-text-field
                class="wait"
                :hide-details="true"
                maxlength="16"
                label="Wait"
                v-model="wait"
                v-on:keyup.enter="waitSend"></v-text-field>
              </v-flex>            
        
      </v-layout>
    </v-card-text>

  </v-card>
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
    }),
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
      triggerDrop() {
        this.operations.add({ command: 'paint.drop' }).on("value", (snapshot) => {});
      },

      triggerGetStatus() {
        this.operations.add({ command: 'paint.get.status' }).on("value", (snapshot) => {});
      },

      setManualModeToEnabled() {
        this.operations.add({ command: 'paint.set.manual' , data: { manual: 0 } }).on("value", (snapshot) => {});
      },

      setManualModeToDisabled() {
        this.operations.add({ command: 'paint.set.manual' , data: { manual: 1 } }).on("value", (snapshot) => {});
      },

      turnManualModeOff() {
        this.operations.add({ command: 'paint.set.manual' , data: { manual: 2 } }).on("value", (snapshot) => {});
      },

      thresholdSend() {
        this.operations.add({ command: 'paint.set.threshold', data: { threshold: this.threshold } }).on("value", (snapshot) => {});
      },

      waitSend() {
        this.operations.add({ command: 'paint.set.wait', data: { wait: this.wait } }).on("value", (snapshot) => {});
      }
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
  width:50px;
  display:inline-block;
}
</style>

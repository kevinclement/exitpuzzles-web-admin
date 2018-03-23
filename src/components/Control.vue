<template>
 <v-container fluid fill-height>
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
                          <v-btn class="ma-0" small color="accent" dark>Trigger</v-btn>
                          </div>
                        </div>
                      </v-flex>
                      <v-flex xs6>
                        <div style="display:block">
                          <span>Wires</span>
                          <div>
                          <v-btn class="ma-0" small color="accent" dark>Trigger</v-btn>
                          </div>
                        </div>
                      </v-flex>
                    </div>

                    <div style="display:flex">
                      <v-flex xs6>
                        <div style="display:block">
                          <span>Switch Errors</span>
                          <v-switch primary label="Enabled"></v-switch>
                        </div>
                      </v-flex>
                      <v-flex xs6>
                        <div style="display:block">
                          <span>Wire Errors</span>
                          <v-switch primary label="Enabled"></v-switch>
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
                          <v-list-tile-content>Toggle 1:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#4CAF50">check_circle</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>Toggle 2:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#BDBDBD">help</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>Wire:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#F44336">error</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider/>
                        <v-list-tile>
                          <v-list-tile-content>Key Solved:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#4CAF50">done</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>All Solved:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#4CAF50">done_all</v-icon>
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
      controlsRef: null
    }
  },

  mounted() {
    this.controlsRef = this.$root.$data.fbdb.ref('control')

    // this.controlsRef.orderByChild('completed').equalTo(null).on("child_added", function(snapshot) {
    //   console.log('control: ' + snapshot.val().op)
    // });
  },

  methods: {
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
    }
  }
}
</script>

<style scoped>
</style>

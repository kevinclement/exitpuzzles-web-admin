<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">access_time</v-icon>Clock
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
      <v-btn v-if="!solved" flat icon class="actionButton" @click.native="dialog = true"><v-icon>lock</v-icon></v-btn>
      
      <span class="spacer" />

      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'clock')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really open the clock?</v-card-title>
      <v-card-text>Are you sure you want to trigger opening the device?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="dialog = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="trigger">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations'],
    data: () => ({
      isConnected: true,
      solved: false,
      dialog: false,
    }),
    created () {
      this.$root.$data.museumRoot.child('devices/clock').on('value', (snapshot) => {
        let clock = snapshot.val()
        if (clock == null) return

        this.solved = clock.solved
      })
    },
    methods: {
      trigger() {
        this.dialog = false

        this.operations.add({ command: 'clock.open' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Opened successfully.')
          }
        });

      }
    }
  }
</script>

<style scoped>
.cardIcon {
  margin-bottom:3px;
  margin-left:7px;
  padding-right:10px;
}
.notConnected {
  color:red !important;
}
.time {
  font-family: Monaco, monospace;
  font-size:16px;
}
.actionButton {
  margin-left:0px;
  color: rgb(158,158,158);
}
</style>

<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">room_service</v-icon>Birdcage
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
      
      <v-btn flat icon color="grey" style="margin-left:0px;" @click.native="dialog = true"><v-icon>{{ocIcon}}</v-icon></v-btn>

      <span class="spacer" />

      <span class="password">{{password}}</span>
      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'birdcage')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really {{dialogTitle}} the tray?</v-card-title>
      <v-card-text>Are you sure you want to trigger {{dialogText}} the device?</v-card-text>
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
      dialog: false,

      solved: false,
      lightValue: 0,
      trayOpened: false,
      password: ""
    }),
    computed: {
      ocIcon() {
        return this.solved ? "arrow_back" : "arrow_forward"
      },
      dialogTitle: function() {
        return this.solved ? "close" : "open";
      },
      dialogText: function() {
        return this.solved ? "closing" : "opening";
      },
    },
    created () {
      this.$root.$data.museumRoot.child('devices/bird').on('value', (snapshot) => {
        let bird = snapshot.val()
        if (bird == null) return

        this.solved = bird.solved
        this.lightValue = bird.lightValue
        this.trayOpened = bird.trayOpened
        this.password = bird.password
      })
    },
    methods: {
      trigger() {
        this.dialog = false
        let cmd = this.solved ? 'bird.close' : 'bird.open'
        let cmdTxt = this.solved ? 'Closed' : 'Opened'

        this.operations.add({ command: cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack(`${cmtTxt} successfully.`)
          }
        });

      },
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
.password {
  font-family: Monaco, monospace;
  font-size:16px;
}
</style>

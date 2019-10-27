<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <span class="secTitle" @click="$root.$emit('show-details', 'bird')"><v-icon class="cardIcon">room_service</v-icon>Birdcage</span>
      </v-toolbar-title>
      
      <v-btn v-if="isConnected && (!solved || trayOpened)" flat icon class="actionButton" @click.native="dialog = true" title="open tray"><v-icon>{{ocIcon}}</v-icon></v-btn>
      <!-- <v-btn v-if="solved && !trayOpened" flat icon class="actionButton" @click.native="trayBack"><v-icon>remove</v-icon></v-btn>
      <v-btn v-if="solved && !trayOpened" flat icon class="actionButton" @click.native="trayForward"><v-icon>add</v-icon></v-btn> -->

      <span class="spacer" />

      <div class="status">
        <v-icon :color="lightColor()">highlight</v-icon>
        <!-- <span class="password">{{password}}</span> -->
      </div>

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
      isLight: false,
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
        this.isLight = bird.isLight
        this.isConnected = bird.info.isConnected
      })
    },
    methods: {
      trayBack() {
        this.operations.add({ command: 'bird.back' }).on("value", (snapshot) => {});
      },
      trayForward() {
        this.operations.add({ command: 'bird.forward' }).on("value", (snapshot) => {});
      },

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

      lightColor() {
        return this.isLight ? "grey lighten-2" : "grey darken-3"
      }
    }
  }
</script>

<style scoped>
.password {
  font-family: Monaco, monospace;
  font-size:16px;
}
</style>

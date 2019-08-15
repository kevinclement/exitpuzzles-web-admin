<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px">
        <v-icon class="cardIcon">meeting_room</v-icon>Cabinet
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
      <v-btn flat icon color="grey" style="margin-left:0px;" @click.native="dialog = true"><v-icon>{{ocIcon}}</v-icon></v-btn>
      <span class="spacer" />
      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'cabinet')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really {{dialogTitle}} the cabinet?</v-card-title>
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
      isOpened: false,
      dialog: false,
    }),
    computed: {
      ocIcon() {
        return this.isOpened ? "lock_open" : "lock"
      },
      dialogTitle: function() {
        return this.isOpened ? "close" : "open"
      },
      dialogText: function() {
        return this.isOpened ? "closing" : "opening"
      },
    },
    created () {
      this.$root.$data.museumRoot.child('cabinet').on('value', (snapshot) => {
        let cabinet = snapshot.val()
        if (cabinet == null) return

        this.isOpened = cabinet.opened;
      })
    },
    methods: {
      trigger() {
        this.dialog = false

        var cmd = this.isOpened ? 'close' : 'solved'
        this.operations.add({ command: 'cabinet.' + cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Opened successfully.')
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
  padding-right: 10px;
}
.notConnected {
  color:red !important;
}
</style>

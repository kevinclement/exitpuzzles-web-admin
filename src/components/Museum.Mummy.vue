<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">accessibility_new</v-icon>Mummy
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
      <v-btn v-if="!isOpened" flat icon class="actionButton" @click.native="dialog=true"><v-icon>{{ocIcon}}</v-icon></v-btn>
      <span class="spacer" />
      <!-- <v-btn flat small color="blue-grey lighten-3" @click.native="$emit('show-details')">Advanced</v-btn> -->
      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'mummy')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really {{dialogTitle}} the mummy?</v-card-title>
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
      ocIcon: function() 
      {
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
      this.$root.$data.museumRoot.child('devices/mummy').on('value', (snapshot) => {
        let mummy = snapshot.val()
        if (mummy == null) return

        this.isOpened = mummy.opened;
      })
    },
    methods: {
      trigger() {
        this.dialog = false

        var cmd = this.isOpened ? 'close' : 'solve'
        this.operations.add({ command: 'mummy.' + cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Mummy solve triggered successfully.')
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
.actionButton {
  margin-left:0px;
  color: rgb(158,158,158) !important;
}
.notConnected {
  color:red !important;
}
</style>

<template>
<v-flex>
  <v-card>
    <v-toolbar card>
      <v-toolbar-title>Mummy
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>

      </v-toolbar-title>
      <span class="spacer" />
      <v-btn flat small color="blue-grey lighten-3" @click.native="$root.$emit('show-details', 'aPanel')">Advanced</v-btn>
      <v-btn flat small color="red lighten-3" @click.native="reboot = true">Reboot</v-btn>
    </v-toolbar>

    <v-card-text class="grey lighten-3">
      <div style="display: flex;flex-flow: row wrap;">
        <div style="padding-top: 10px;">
          <v-btn 
            class="ma-0"
            small dark color="accent"
            @click.native="dialog = true">{{dialogTitle}}
          </v-btn>
        </div>
      </div>

    </v-card-text>
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
      dialogTitle: function() {
        return this.isOpened ? "close" : "open";
      },
      dialogText: function() {
        return this.isOpened ? "closing" : "opening";
      },
    },
    created () {
      // this.operations = this.$root.$data.operations

      // this.$root.$data.museumRoot.child('devices/mummy').on('value', (snapshot) => {
      // let mummy = snapshot.val()
      //   if (mummy == null) return

      //   console.log('opened: ' + mummy.opened);
      //   this.isOpened = mummy.opened;
      // })
    },
    methods: {
      trigger() {
        this.dialog = false
        // this.operations.add({ command: 'paint.drop' }).on("value", (snapshot) => {
        //   if (snapshot.val().received) {
        //     this.snack('Dropped successfully.')
        //   }
        // });
      },
    }
  }
</script>

<style scoped>
.cardIcon {
  margin-bottom:4px;
  margin-left:7px;
}
.notConnected {
  color:red !important;
}
</style>

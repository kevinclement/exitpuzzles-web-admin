M<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">person</v-icon>Zoltar
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>

      <v-btn flat icon color="grey" style="margin-left:0px;" @click.native="dialog = true"><v-icon>message</v-icon></v-btn>

      <span class="spacer" />

      <v-icon color="grey darken-3">monetization_on</v-icon>
      <v-icon color="grey lighten-2">monetization_on</v-icon>
      <v-icon color="grey lighten-2">monetization_on</v-icon>


      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'mausoleum')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really open the final door?</v-card-title>
      <v-card-text>Are you sure you want to trigger opening the exit door?</v-card-text>
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
        return this.isOpened ? "arrow_back" : "arrow_forward"
      },
    },
    created () {
      this.$root.$data.museumRoot.child('mausoleum').on('value', (snapshot) => {
        let mausoleum = snapshot.val()
        if (mausoleum == null) return

        this.isOpened = mausoleum.opened;
      })
    },
    methods: {
      trigger() {
        this.dialog = false

        this.operations.add({ command: 'mausoleum.open' + cmd }).on("value", (snapshot) => {
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
  padding-right:10px;
}
.notConnected {
  color:red !important;
}
</style>

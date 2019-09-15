<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">line_weight</v-icon>Stairs
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
      <v-btn flat icon color="grey" style="margin-left:0px;" @click.native="dialog = true"><v-icon>{{ocIcon}}</v-icon></v-btn>
      <span class="spacer" />
      {{level}}
      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'stairs')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really open the stairs?</v-card-title>
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
      isOpened: false,
      dialog: false,
      level: 0,
    }),
    computed: {
      ocIcon() {
        return this.isOpened ? "lock_open" : "lock"
      },
    },
    created () {
      this.$root.$data.museumRoot.child('stairs').on('value', (snapshot) => {
        let stairs = snapshot.val()
        if (stairs == null) return

        this.isOpened = stairs.magnet;
        this.level = stairs.level;
      })
    },
    methods: {
      trigger() {
        this.dialog = false

        this.operations.add({ command: 'stairs.open' + cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Open successfully.')
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

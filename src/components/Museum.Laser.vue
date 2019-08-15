<template>
<v-flex>
  <v-card flat class="aCard">
    <v-toolbar card>
      <v-toolbar-title style="width:175px;">
        <v-icon class="cardIcon">trending_down</v-icon>Laser
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
      <v-switch 
        primary
        v-model="enabled"
        :hide-details="true"
      />
      <span class="spacer" />
      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'laser')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really {{dialogTitle}} the laser?</v-card-title>
      <v-card-text>Are you sure you want to trigger {{dialogText}} the laser?</v-card-text>
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
      enabled: false,
      dialog: false,
    }),
    computed: {
      dialogTitle: function() {
        return this.enabled ? "enable" : "disable"
      },
      dialogText: function() {
        return this.enabled ? "enabling" : "disabling"
      },
    },
    created () {
      this.$root.$data.museumRoot.child('laser').on('value', (snapshot) => {
        let laser = snapshot.val()
        if (laser == null) return

        this.enabled = laser.enabled;
      })
    },
    methods: {
      trigger() {
        this.dialog = false

        var cmd = this.enabled ? 'enable' : 'disable'
        this.operations.add({ command: 'laser.' + cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Dropped successfully.')
          }
        });

      },
    }
  }
</script>

<style scoped>
.aCard { 
}
.cardIcon {
  margin-bottom:3px;
  margin-left:7px;
  padding-right: 10px;
}
.notConnected {
  color:red !important;
}
</style>

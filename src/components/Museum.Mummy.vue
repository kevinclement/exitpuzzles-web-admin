<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <span class="secTitle" @click="$root.$emit('show-details', 'mummy')"><v-icon class="cardIcon">accessibility_new</v-icon>Mummy</span>
      </v-toolbar-title>

      <v-btn v-if="isConnected && !isOpened" flat icon class="actionButton" @click.native="dialog=true"><v-icon>{{ocIcon}}</v-icon></v-btn>

      <span class="spacer" />

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

        this.isOpened = mummy.opened
        this.isConnected = mummy.info.isConnected
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
</style>

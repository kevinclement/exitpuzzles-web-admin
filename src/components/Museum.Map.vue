<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <span class="secTitle" @click="$root.$emit('show-details', 'map')"><v-icon class="cardIcon">language</v-icon>Map</span>
      </v-toolbar-title>

      <div v-if="isConnected">
        <v-btn flat icon class="actionButton" @click.native="dialog = true" title="show code"><v-icon>wb_iridescent</v-icon></v-btn>
      </div>

      <span class="spacer" />

      <span class="results status">
        {{enabled}}/{{total}}
      </span>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really solve the map?</v-card-title>
      <v-card-text>Are you sure you want to reveal the code on the map?</v-card-text>
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
    props: ['snack', 'operations', 'isConnected'],
    data: () => ({
      dialog: false,
      total:0,
      enabled:0
    }),
    created () {
      this.$root.$data.museumRoot.child('devices/map').on('value', (snapshot) => {
        let map = snapshot.val()
        if (map == null) return

        this.total = 0
        this.enabled = 0
        for (const [name, state] of Object.entries(map.magnets)) {
          this.total++;
          if (state) {
            this.enabled++;
          }
        }
        
      })
    },
    methods: {
      trigger() {
        this.dialog = false
        this.operations.addWithToast('map.force', () => {
          this.snack('Forced solved successfully')
        })
      }
    }
  }
</script>

<style scoped>
.results {
  font-family: Monaco, monospace;
  font-size: 16px;
}
</style>

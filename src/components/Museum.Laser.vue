<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <span class="secTitle" @click="$root.$emit('show-details', 'laser')"><v-icon class="cardIcon">trending_down</v-icon>Laser</span>
      </v-toolbar-title>
      <v-switch
        v-if="isConnected" 
        primary
        v-model="enabled"
        :hide-details="true"
        @change="trigger"
      />
      <span class="spacer" />

    </v-toolbar>
  </v-card>
</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations'],
    data: () => ({
      isConnected: true,
      enabled: false
    }),
    created () {
      this.$root.$data.museumRoot.child('devices/laser').on('value', (snapshot) => {
        let laser = snapshot.val()
        if (laser == null) return
        this.enabled = laser.enabled
        this.isConnected = laser.info.isConnected
      })
    },
    methods: {
      trigger() {
        var cmd = this.enabled ? 'enable' : 'disable'
        this.operations.add({ command: 'laser.' + cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Laser ' + cmd + 'd successfully.')
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
  padding-right:0px;
}
</style>

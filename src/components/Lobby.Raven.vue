<template>
  <v-flex>
    <v-card flat>
      <v-toolbar card>
        <v-toolbar-title style="width:175px;color:#757575">
          <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
          <span class="secTitle"><v-icon class="cardIcon">trending_down</v-icon>Raven</span>
        </v-toolbar-title>
        <v-switch
          v-if="isConnected" 
          primary
          v-model="animationEnabled"
          :hide-details="true"
          @change="updateAnimationEnabled"
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
      animationEnabled: false,
      animationWaitTimeMin: 0
    }),
    created () {
      this.$root.$data.lobbyRoot.child('devices/raven').on('value', (snapshot) => {
        let raven = snapshot.val()
        if (raven == null) return

        this.animationEnabled = raven.animationEnabled
        this.animationWaitTimeMin = raven.animationWaitTimeMin
      })
    },
    methods: {
      updateAnimationEnabled() {
        // var cmd = this.enabled ? 'enable' : 'disable'
        // this.operations.add({ command: 'laser.' + cmd }).on("value", (snapshot) => {
        //   if (snapshot.val().received) {
        //     this.snack('Laser ' + cmd + 'd successfully.')
        //   }
        // });

      },
    }
  }
</script>

<style scoped>
</style>

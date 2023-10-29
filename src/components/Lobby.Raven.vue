<template>
  <v-flex>
   
    <!-- 
        precision_manufacturing
    
    -->

    <!-- raven card -->
    <v-card flat>
      <v-toolbar card>
        <v-toolbar-title style="width:150px;color:#757575">
          <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
          <span class="secTitle" @click="$root.$emit('show-details', 'raven')"><v-icon class="cardIcon">precision_manufacturing</v-icon>Raven</span>
        </v-toolbar-title>
        
        <v-btn icon class="actionButton" @click.native="triggerAnimation" title="run animation"><v-icon>play_circle</v-icon></v-btn>
        <v-btn icon class="actionButton" @click.native="triggerAnimation" title="trigger 3 caws"><v-icon>record_voice_over</v-icon></v-btn>

        <div style="display:block;padding-left:10px;">
          <v-switch
          style="width:50px;"
          v-if="isConnected" 
          primary
          v-model="animationEnabled"
          :hide-details="true"
          @change="updateAnimationEnabled" />
        </div>

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
    }),
    created () {
      this.$root.$data.lobbyRoot.child('devices/raven').on('value', (snapshot) => {
        let raven = snapshot.val()
        if (raven == null) return

        this.animationEnabled = raven.animationEnabled
      })
    },
    methods: {
      triggerAnimation() {
      },
      triggerTripleCaw() {
      },
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

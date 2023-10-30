<template>
  <v-flex>
   
    <!-- raven card -->
    <v-card flat>
      <v-toolbar card>
        <v-toolbar-title style="width:150px;color:#757575">
          <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
          <span class="secTitle" @click="$root.$emit('show-details', 'raven')">
            <img style="vertical-align: middle; padding-bottom:3px;padding-right:5px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAAqo0jMgAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+cKHgAFLHJMITEAAAFYSURBVDjLpdJNS1RhGMbx3xkVJ1o5Ri6EQBQSTCVMMHxZKEiEoSgifgc/gZ/IhYLYIlfSIlwIMimCQhYhKtQm3xgNmtFFzpwzM+c0SPfqXNe5/s9zn/vcPLCCmomnBjXLuXLul6/1NeJPLEiX1JXNWsB0KX5t1a78v4DApI6S2pKFZCBlRn9Et0opUJcYn9NX5mScOSGVEJ/3ssrt+PsqrvdZvTH+ZTwQmKpopljZOCDwzuvY+BfHccCEodj4H2vFz4vWiOGEqX3woxro9DYhvudTOMDwaS5hyMeW3BZF+ONunXlRtb2nPnrvd2iEq9FlNuaGVd/LjSIwYKosnncu48hR5Qn1CIwbu9c56356ZseNRRsK1UB0K/etuMA3pBS063bos3wU6LmPX1uzXfJfaZLWJuOxfbkoMAoOLLuI3HyjUaDFqWw0Ds+90V3RaJ0mNErjkQb/U3dPQkfgPii7DQAAAABJRU5ErkJggg==" />
            Raven
          </span>
        </v-toolbar-title>
        
        <v-btn icon class="actionButton" @click.native="triggerAnimation" title="run animation"><v-icon>play_circle</v-icon></v-btn>
        <v-btn icon class="actionButton" @click.native="triggerTripleCaw" title="trigger 3 caws"><v-icon>record_voice_over</v-icon></v-btn>

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
        this.operations.add({ command: 'raven.animate' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Raven animated successfully.')
          }
        });
      },
      triggerTripleCaw() {
        this.operations.add({ command: 'raven.caw' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Raven cawed successfully.')
          }
        });
      },
      updateAnimationEnabled() {
        var cmd = this.animationEnabled ? 'enable' : 'disable'
        this.operations.add({ command: 'raven.' + cmd }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Raven ' + cmd + 'd successfully.')
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>

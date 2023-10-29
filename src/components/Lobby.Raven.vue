<template>
  <v-flex>
   
    <!-- raven card -->
    <v-card flat>
      <v-toolbar card>
        <v-toolbar-title style="width:175px;color:#757575">
          <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
          <span class="secTitle" @click="$root.$emit('show-details', 'raven')">Raven</span>
        </v-toolbar-title>
        
        <v-btn icon class="actionButton" @click.native="triggerAnimation" title="insert disk"><v-icon>save</v-icon></v-btn>
        <v-btn icon class="actionButton" @click.native="triggerAnimation" title="insert disk"><v-icon>save</v-icon></v-btn>
        
        <!-- Enable toggle -->
        <!-- <v-switch
          style=""
          v-if="isConnected" 
          primary
          v-model="animationEnabled"
          :hide-details="true"
          @change="updateAnimationEnabled"
        /> -->

        <!-- <v-card-text class="" style="">
        <v-text-field 
            class="wait"
            :hide-details="true"
            maxlength="16"
            label="Wait Time (min)"
            type="number"
            v-model="animationWaitTimeMin"
            v-on:keyup.enter="waitSend"></v-text-field>
          </v-card-text> -->

        <!-- Wait time -->
        <!-- <v-card-text class="" style="">
        
          <v-text-field 
            class="wait"
            :hide-details="true"
            maxlength="16"
            label="Wait Time (min)"
            type="number"
            v-model="animationWaitTimeMin"
            v-on:keyup.enter="waitSend"></v-text-field>
                      
          <div><a v-on:click.stop="resetDefault">reset default</a></div>

        </v-card-text> -->

      </v-toolbar>
    </v-card>

    <!-- <v-card class="ravenCard">
      <v-toolbar card>
        <v-toolbar-title>
          ♟️ Raven          
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="grey lighten-3">
      
      <v-text-field 
        class="wait"
        :hide-details="true"
        maxlength="16"
        label="Wait Time (min)"
        type="number"
        v-model="animationWaitTimeMin"
        v-on:keyup.enter="waitSend"></v-text-field>
                  
     <div><a v-on:click.stop="resetDefault">reset default</a></div>

    </v-card-text>
    </v-card> -->

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
      waitSend() {
        alert('going to udate wait time to ' + this.animationWaitTimeMin);
        // this.operations.add({ command: 'paint.setWait', data: { wait: this.wait } }).on("value", (snapshot) => {
        //   if (snapshot.val().received) {
        //     this.snack('Set wait time successfully.')
        //   }
        // });
      },
      boolToOnOff: function(b) {
        return b ? "ON" : "OFF"
      },
      resetDefault() {
        this.animationWaitTimeMin = 5
        this.waitSend();
      },
    }
  }
</script>

<style scoped>
.ravenCard {
  /* margin-top: 30px; */
}

.wait {
  display:inline-block;
  width:150px;
}

</style>

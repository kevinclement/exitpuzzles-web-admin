<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <span style="cursor:pointer" @click="$root.$emit('show-details', 'clock')"><v-icon class="cardIcon">access_time</v-icon>Clock</span>
      </v-toolbar-title>

      <v-btn v-if="isConnected" flat icon class="actionButton" @click.native="toggleMotor" :title="motorTitle"><v-icon>{{motorIcon}}</v-icon></v-btn>
      <v-btn v-if="!solved && isConnected" flat icon class="actionButton" @click.native="dialog = true"><v-icon>lock</v-icon></v-btn>

      <span class="spacer" />

      <span :class="{ timeReached:hour }" class="time">H</span>
      <span :class="{ timeReached:minute }" class="time">M</span>
      <v-btn  v-if="isConnected" flat small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'clock')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really open the clock?</v-card-title>
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
      solved: false,
      motor: false,
      hour: false,
      minute: false,
      motor: false,
      dialog: false,
    }),
    computed: {
      motorTitle: function() {
        return this.motor ? "disable motor" : "enable motor"
      },
      motorIcon: function() {
        return this.motor ? "timer" : "timer_off"
      }
    },
    created () {
      this.$root.$data.museumRoot.child('devices/clock').on('value', (snapshot) => {
        let clock = snapshot.val()
        if (clock == null) return

        this.solved = clock.solved
        this.isConnected = clock.info.isConnected
        this.hour = clock.hs
        this.minute = clock.ms
        this.motor = clock.motor
      })
    },
    methods: {
      trigger() {
        this.dialog = false
        this.operations.addWithToast('clock.open', this.snack('Opened successfully'))
      },
      toggleMotor() {
        this.operations.addWithToast('clock.motor', this.snack('Motor toggled'))
      }
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
  padding-right:0px;
}
.actionButton {
  margin-left:0px;
  color: rgb(158,158,158) !important;
}
.time {
  border-radius: 50%;
  background: #e0e0e0;
  height: 20px;
  width: 20px;
  text-align: center;
  line-height: 20px;
  color: white;
  font-size: 12px;
  margin:2px;
}
.timeReached {
  background: #424242;
}
</style>

<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        
        <span class="secTitle" @click="$root.$emit('show-details', 'timer')"><v-icon class="cardIcon">hourglass_full</v-icon>Timer</span>
      </v-toolbar-title>

      <span class="spacer" />
      <span class="time">{{prettyHoursAndMinutes}}</span>
    </v-toolbar>
  </v-card>

</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations'],
    data: () => ({
      isConnected: true,
      hours:-1,
      minutes:-1
    }),
    computed: {
      prettyHoursAndMinutes: function() {
        if (this.hours == -1 || this.hours == 0 && this.minutes == 0) {
          return ''
        }

        let hStr = this.hours > 0 ? `${this.hours}h ` : ''
        let mStr = this.minutes < 10 && this.minutes >= 0 ? `0${this.minutes}m` : `${Math.abs(this.minutes)}m`

        return `${hStr}${mStr}`;
      },
    },
    created () {
      this.$root.$data.museumRoot.child('devices/dashboard').on('value', (snapshot) => {
        let dash = snapshot.val()
        if (dash == null) return

        this.hours = dash.hours
        this.minutes = dash.minutes
      })
    },
    methods: {
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
.time {
  font-family: Monaco, monospace;
  font-size:16px;
}
</style>

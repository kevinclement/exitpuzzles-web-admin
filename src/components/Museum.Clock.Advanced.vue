<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow" style="padding-bottom:30px;">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'clock')">Reboot</v-btn>
  </div>

  <!-- Analog Clock -->
  <analog-clock 
    v-bind:hourPos="hourPos"
    v-bind:minPos="minPos"
    v-bind:hourSolved="hourSolved"
    v-bind:minSolved="minSolved"
  />

  <div class="actionRow" style="padding-left:15px;font-size:18px;font-weight:400;">
    HOUR
  </div>
  <div class="actionRow">
    <v-btn @click.native="hourInc"><v-icon>add</v-icon></v-btn>
    <v-btn @click.native="hourDec"><v-icon>remove</v-icon></v-btn>
  </div>

  <div class="actionRow" style="padding-top:20px;padding-left:15px;font-size:18px;font-weight:400;">
    MINUTE
  </div>
  <div class="actionRow">
    <v-btn @click.native="minuteInc"><v-icon>add</v-icon></v-btn>
    <v-btn @click.native="minuteDec"><v-icon>remove</v-icon></v-btn>
  </div>
</div>
</template>

<script>
  import AnalogClock from '@/components/Museum.Clock.Advanced.Clock'

  export default {
    props: ['operations'],

    data: () => ({
      hourPos: 0,
      hourSolved: false,
      minPos: 0,
      minSolved: false,
    }),
    computed: {},
    watch: {},
    created () {
      this.$root.$data.museumRoot.child('devices/clock').on('value', (snapshot) => {
        let clock = snapshot.val()
        if (clock == null) return

        this.hourPos = clock.hourMotorPos
        this.hourSolved = clock.hs
        this.minPos = clock.minMotorPos
        this.minSolved = clock.ms
      })
    },
    mounted() {},
    methods: {
      hourInc() {
        this.operations.add({ command: 'clock.hour' }).on("value", (snapshot) => {});
      },
      hourDec() {
        this.operations.add({ command: 'clock.hourDec' }).on("value", (snapshot) => {});
      },
      minuteInc() {
        this.operations.add({ command: 'clock.minute' }).on("value", (snapshot) => {});
      },
      minuteDec() {
        this.operations.add({ command: 'clock.minDec' }).on("value", (snapshot) => {});
      },
    },

    components: {
      'analog-clock': AnalogClock,
    }
  }
</script>

<style scoped>
</style>


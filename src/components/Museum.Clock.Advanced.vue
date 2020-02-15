<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'clock')">Reboot</v-btn>
  </div>

  <div class="actionRow" style="padding-top:100px;padding-left:15px;font-size:18px;font-weight:400;">
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
  export default {
    props: ['operations'],

    data: () => ({
    }),
    computed: {
    },
    created () {
      this.$root.$data.museumRoot.child('devices/clock').on('value', (snapshot) => {
        let clock = snapshot.val()
        if (clock == null) return
      })
    },
    methods: {
      hourInc() {
        this.operations.add({ command: 'clock.hour' }).on("value", (snapshot) => {});
      },
      hourDec() {
        this.operations.add({ command: 'clock.minute' }).on("value", (snapshot) => {});
      },
      minuteInc() {
        this.operations.add({ command: 'clock.hour' }).on("value", (snapshot) => {});
      },
      minuteDec() {
        this.operations.add({ command: 'clock.minDec' }).on("value", (snapshot) => {});
      },
    }
  }
</script>

<style scoped>
</style>


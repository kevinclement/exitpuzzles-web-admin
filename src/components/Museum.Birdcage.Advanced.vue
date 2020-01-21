<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'bird')">Reboot</v-btn>
  </div>
  <div class="actionRow" style="padding-top:100px;">
    <v-btn @click.native="trayBack"><v-icon>navigate_before</v-icon>In</v-btn>
    <v-btn @click.native="trayForward">Out<v-icon>navigate_next</v-icon></v-btn>
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
      this.$root.$data.museumRoot.child('devices/bird').on('value', (snapshot) => {
        let bird = snapshot.val()
        if (bird == null) return
      })
    },
    methods: {
      trayBack() {
        this.operations.add({ command: 'bird.back' }).on("value", (snapshot) => {});
      },
      trayForward() {
        this.operations.add({ command: 'bird.forward' }).on("value", (snapshot) => {});
      },
    }
  }
</script>

<style scoped>
</style>


<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'laser')">Reboot</v-btn>
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
      this.$root.$data.museumRoot.child('devices/laser').on('value', (snapshot) => {
        let laser = snapshot.val()
        if (laser == null) return
      })
    },
    methods: {
    }
  }
</script>

<style scoped>
</style>


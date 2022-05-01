<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'stairs')">Reboot</v-btn>
  </div>
  <div class="actionRow" style="padding-top:15px;">
    <v-btn v-if="!isOpened" small @click.native="toggleUnsolvable"><v-icon style="padding-right:5px;">{{usIcon}}</v-icon>{{usTitle}}</v-btn>
  </div>

</div>
</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      isOpened: false,
      unsolvable: false,
    }),
    computed: {
      usTitle: function() {
        return this.unsolvable ? "make solvable" : "make unsolvable"
      },
      usIcon: function() {
        return this.unsolvable ? "report" : "report_off"
      },
    },
    created () {
      this.$root.$data.museumRoot.child('devices/stairs').on('value', (snapshot) => {
        let stairs = snapshot.val()
        if (stairs == null) return

        this.unsolvable = stairs.unsolvable;
      })
    },
    methods: {
      toggleUnsolvable() {
        this.operations.add({ command: 'stairs.unsolvable' })
      },
    }
  }
</script>

<style scoped>
</style>


<template>
<v-toolbar card color="white">
  <v-toolbar-title>Mummy Advanced</v-toolbar-title>
  <span class="spacer" />
  <a v-on:click.stop="$emit('close-details')"><v-icon>close</v-icon></a>
</v-toolbar>
</template>

<script>
  export default {
    props: [],

    // original number before I stored them in DB, DB should be source of truth
    data: () => ({
      debounce: 500,
      lightning_number_flashes_max: 7,
      lightning_time_between_events: 2579,
      lightning_time_between_flashes: 22,
      measure_one_sensitivity: 1200,
      measure_two_sensitivity: 1000,
    }),
    computed: {
    },
    created () {
      this.$root.$data.museumRoot.child('mummy').on('value', (snapshot) => {
        let mummy = snapshot.val()
        if (mummy == null) return

        this.debounce = mummy.debounce
        this.lightning_number_flashes_max = mummy.lightning_number_flashes_max
        this.lightning_time_between_events = mummy.lightning_time_between_events
        this.lightning_time_between_flashes = mummy.lightning_time_between_flashes
        this.measure_one_sensitivity = mummy.measure_one_sensitivity
        this.measure_two_sensitivity = mummy.measure_two_sensitivity
      })
    },
    methods: {
      trigger() {
      },
    }
  }
</script>

<style scoped>
</style>

<template>
<v-toolbar card color="white">
  <v-toolbar-title>TEMPLATE Advanced</v-toolbar-title>
  <span class="spacer" />
  <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
</v-toolbar>
</template>

<script>
  export default {
    props: ['snack'],
    data: () => ({
    }),
    computed: {
    },
    created () {
    },
    methods: {
      trigger() {
      },
    }
  }
</script>

<style scoped>
</style>

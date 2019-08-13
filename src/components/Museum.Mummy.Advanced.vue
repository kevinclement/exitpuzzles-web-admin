<template>
<v-toolbar card color="white">
  <v-toolbar-title>Mummy Advanced</v-toolbar-title>
  <span class="spacer" />
  <a v-on:click.stop="$emit('close-details')"><v-icon>close</v-icon></a>
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

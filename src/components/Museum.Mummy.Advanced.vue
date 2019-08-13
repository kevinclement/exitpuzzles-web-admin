<template>
<v-toolbar card color="white">
  <v-toolbar-title>TITLE</v-toolbar-title>
  <span class="spacer" />
  <a v-on:click.stop="showDetails = false"><v-icon>close</v-icon></a>
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

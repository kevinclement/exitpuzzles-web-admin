<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
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
      this.$root.$data.museumRoot.child('devices/dashboard').on('value', (snapshot) => {
        let dash = snapshot.val()
        if (dash == null) return
      })
    },
    methods: {
    }
  }
</script>

<style scoped>
  .actionRow {
    padding-left:10px;
    padding-right: 10px;
    padding-top:15px;
    padding-bottom:10px;
  }
  .actionRow button {
    margin-top:0px;
    margin-bottom:0px;
  }
</style>


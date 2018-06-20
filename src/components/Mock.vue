<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout>
        <v-flex xs2>
          <v-text-field v-model="lastPassword" label="Last Password"></v-text-field>
          <v-btn color="info" @click="save">Save</v-btn>
        </v-flex>
      </v-layout>

    </v-slide-y-transition>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      lastPassword: ''
    }),

    mounted() {
      this.morseRef = this.$root.$data.fbdb.ref('morse')
      this.tntRef = this.$root.$data.fbdb.ref('tnt')

    },

    methods: {
      save() {
        this.tntRef.child('state').set(
          {
            lastBadPassword: this.lastPassword
          }
        )
      }
    }
  }
</script>

<style scoped>
</style>

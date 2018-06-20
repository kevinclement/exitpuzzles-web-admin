<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout>
        <v-flex xs2>
          <v-text-field v-model="lastBadPassword" label="Last Password"></v-text-field>
          <v-checkbox v-model="lightDetected" label="Light Detected"></v-checkbox>
          <v-checkbox v-model="toggle1" label="Toggle 1"></v-checkbox>
          <v-checkbox v-model="toggle2" label="Toggle 2"></v-checkbox>
          <v-checkbox v-model="wire" label="Wire"></v-checkbox>
          <v-checkbox v-model="keySolved" label="Key Solved"></v-checkbox>
          <v-checkbox v-model="allSolved" label="All Solved"></v-checkbox>
          <v-text-field v-model="timeLeftSolved" label="Time Left Solved"></v-text-field>
          <v-btn color="info" @click="save">Save</v-btn>
        </v-flex>
      </v-layout>

    </v-slide-y-transition>
  </v-container>
</template>

<script>
  let STATE = {
    UNKNOWN: 1,
    OK: 2,
    BAD: 3
  }

  export default {
    data: () => ({
      lastBadPassword: '',

      lightDetected: false,
      toggle1: false,
      toggle2: false,
      wire: false,
      keySolved: false,
      allSolved: false,

      timeLeftSolved: 0,
    }),

    mounted() {
      this.morseRef = this.$root.$data.fbdb.ref('morse')
      this.tntRef = this.$root.$data.fbdb.ref('tnt')

      this.tntRef.child('state').on('value', (snapshot) => {
        let state = snapshot.val()
        if (state == null) return

        this.lastBadPassword = state.lastBadPassword
        this.lightDetected   = state.lightDetected
        this.toggle1 = state.toggle1 === STATE.OK
        this.toggle2 = state.toggle2 === STATE.OK
        this.wire = state.wire === STATE.OK
        this.keySolved = state.keySolved === STATE.OK
        this.allSolved = state.allSolved === STATE.OK

        this.timeLeftSolved  = state.timeLeftSolved

        // this.switchErrors    = state.switchErrors
        // this.wireErrors      = state.wireErrors
      })
    },

    methods: {
      save() {
        this.tntRef.child('state').update(
          {
            lastBadPassword: this.lastBadPassword,

            lightDetected: this.lightDetected,
            toggle1: this.toggle1 ? STATE.OK : STATE.BAD,
            toggle2: this.toggle2 ? STATE.OK : STATE.BAD,
            wire: this.wire ? STATE.OK : STATE.BAD,
            keySolved: this.keySolved ? STATE.OK : STATE.UNKNOWN,
            allSolved: this.allSolved ? STATE.OK : STATE.UNKNOWN,

            timeLeftSolved: this.timeLeftSolved
          }
        )
      }
    }
  }
</script>

<style scoped>
</style>

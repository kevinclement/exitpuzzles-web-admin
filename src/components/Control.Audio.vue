<template>
  <v-flex>

    <!-- audio card -->
    <v-card class="audioCard">
      <v-toolbar card>
        <v-toolbar-title>
          Audio
        </v-toolbar-title>
        <span class="spacer" />
      </v-toolbar>

      <v-card-text class="grey lighten-3">
        <v-layout row wrap>
          <v-flex xs12 md6>
            PUT AUDIO BUTTONS HERE
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

  </v-flex>
</template>

<script>
export default {
  props: ['snack'],
  data () {
    return {
      audioRef: null
    }
  },

  computed: {
  },

  watch: {
  },

  methods: {
  },

  mounted() {
    this.operations = this.$root.$data.operations
    this.audioRef = this.$root.$data.fbdb.ref('audio')

    // this.audioRef.child('time').on('value', (snapshot) => {
    //   let time = snapshot.val()
    //   if (time == null) return

    //   // update might be partial, so fill out from our state
    //   let h = time.hours ? time.hours : this.hours
    //   let m = time.minutes ? time.minutes : this.minutes
    //   let s = time.seconds ? time.seconds : this.seconds
    //   let ts = time.timestamp ? time.timestamp : this.timerTimeStamp
    //   let elapsed = Math.floor(((new Date()).getTime() - ts) / 1000)

    //   this.timeLeftInSeconds = (h * 3600) + (m * 60) + s - elapsed
    //   this.timerTimeStamp = ts
    // });
  }

}
</script>

<style scoped>
.audioCard {
  margin-top: 30px;
}
</style>

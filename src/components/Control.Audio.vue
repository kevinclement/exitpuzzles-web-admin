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

          <v-flex xs12 sm6>

            <v-btn color="blue accent-1" fab dark v-for="file in files" :key="file.file">
              <v-icon>{{file.icon}}</v-icon>
            </v-btn>

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
      audioRef: null,
      files: []
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

    this.audioRef.on("child_added", (snapshot) => {
      var audio = snapshot.val();
      console.log('a: ' + audio.file)
      this.files.push(audio)

    });
    //this.audioRef.push({ name: 'File 1', icon: 'filter_1', file: 'TBD2.wav'});

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

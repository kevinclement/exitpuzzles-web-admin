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

            <v-btn color="blue accent-1" fab dark v-for="file in files" :key="file.file" @click.native="play(file)">
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
    play(file) {

      this.operations.add({ command: 'audio', file: file }).on("value", (snapshot) => {
        let command = snapshot.val()
        if (command.received) {
          // pop snack letting user know  we triggered it
          this.snack('Playing \'' + file.file + '\'.')
          // disable further update notifications
          snapshot.ref.off()
        }
      });
    }
  },

  mounted() {
    this.operations = this.$root.$data.operations
    this.audioRef = this.$root.$data.fbdb.ref('audio')

    // TMP: used to build out files in DB
    //this.audioRef.push({ name: 'File 1', icon: 'filter_1', file: 'TBD2.wav'});

    this.audioRef.on("child_added", (snapshot) => {
      var audio = snapshot.val();
      this.files.push(audio)
    });

  }

}
</script>

<style scoped>
.audioCard {
  margin-top: 30px;
}
</style>

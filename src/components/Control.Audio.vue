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

          <v-flex>

            <v-tooltip bottom light open-delay="1000" v-for="file in files" :key="file.file">
                <v-btn fab dark slot="activator" :color="iconBackground(file)" @click.native="play(file)">
                  <v-icon :color="iconForeground(file)">{{file.icon}}</v-icon>
                </v-btn>
                <span>{{file.name}}</span>
            </v-tooltip>

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
    },

    iconForeground(file) {
      return file.foreground ? file.foreground : ''
    },

    iconBackground(file) {
      var bg = file.background ? file.background : 'blue'
      return bg + ' accent-1'
    }
  },

  mounted() {
    this.operations = this.$root.$data.operations
    this.audioRef = this.$root.$data.fbdb.ref('audio')

    // TMP: used to build out files in DB
    // for (var i=0;i<11;i++) {
    //   this.audioRef.child(i).set({ name: 'File ' + i, icon: 'filter_1', file: 'file.wav'});
    //}

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

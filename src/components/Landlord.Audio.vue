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

        <v-layout row wrap style="padding-top:15px;">
          <v-flex>
            <v-tooltip bottom light open-delay="1000" v-for="song in music" :key="song.name">
                <v-btn fab dark slot="activator" color="deep-purple accent-1" @click.native="playSong(song)">
                  <v-icon>{{ iconForSong(song) }}</v-icon>
                </v-btn>
                <span>{{song.title}}</span>
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
      firstLoad: true,
      files: [],
      music: [
        { title: 'Jump in Line',         name:'jump_in_line_karaoke_45s_fade_out.mp3', icon:'star',           playing: false, onWin: true  },
        { title: 'Losing Horn',          name:'losing_horn.mp3',                       icon:'volume_up',      playing: false, onFail:true  },
        { title: 'Blue Moon',            name:'blue_moon.mp3',                         icon:'language',       playing: false               },
        { title: 'Science',              name:'success.m4a',                           icon:'surround_sound', playing: false               },
      ]
    }
  },

  computed: {
  },

  watch: {
  },

  methods: {
    play(file) {

      this.operations.add({ command: 'tnt.playAudio', file: file }).on("value", (snapshot) => {
        let command = snapshot.val()
        if (command.received) {
          this.snack('Playing \'' + file.file + '\'.')
          snapshot.ref.off()
        }
      });
    },

    playSong(song) {

      let aRef = document.getElementById('musicAudio');

      // already playing, so lets pause it
      if (song.playing) {
        aRef.pause();
        song.playing = false;
        return;
      }

      // update turn off any other song playing
      for(var i=0; i < this.music.length; i++) {
        this.music[i].playing = false;
      }

      // set this one to playing
      song.playing = true;

      // play it
      aRef.src = '/static/' + song.name
      aRef.onended = function() {
        song.playing = false
      }
      aRef.play();
    },

    iconForeground(file) {
      return file.foreground ? file.foreground : ''
    },

    iconBackground(file) {
      var bg = file.background ? file.background : 'blue'
      return bg + ' accent-1'
    },

    iconForSong(song) {
      if (song.playing) {
        return 'stop'
      } else {
        return song.icon
      }
    }
  },

  mounted() {
    this.operations = this.$root.$data.operations
    this.audioRef = this.$root.$data.fbdb.ref('landlord/audio')

    // TMP: used to build out files in DB
    // for (var i=0;i<11;i++) {
    //   this.audioRef.child(i).set({ name: 'File ' + i, icon: 'filter_1', file: 'file.wav'});
    //}

    this.audioRef.on("child_added", (snapshot) => {
      var audio = snapshot.val();
      this.files.push(audio)
    });

    // listen for solved state change so we can play song
    this.tntRef = this.$root.$data.fbdb.ref('landlord/devices/tnt')
    this.tntRef.on('value', (snapshot) => {
      let state = snapshot.val()
      if (state == null) return

      // there was a state change for time left, so we witnessed a solve, so lets play song
      if (this.pSong != state.playSong && state.playSong != "") {
        if (this.firstLoad) {
          console.log(`Got a db playsong for '${state.playSong}' but this is page first load so ignoring`)
        } else {
          for(var i=0; i < this.music.length; i++) {
            if (!this.music[i].playing && 
                ( 
                  (state.playSong == "WIN" && this.music[i].onWin) ||
                  (state.playSong == "FAIL" && this.music[i].onFail) 
                )
              ){
              this.playSong(this.music[i]);
            }
          }
        }
      }

      this.pSong = state.playSong;
      this.firstLoad = false;
    });
  }
}
</script>

<style scoped>
.audioCard {
  margin-top: 30px;
}
</style>

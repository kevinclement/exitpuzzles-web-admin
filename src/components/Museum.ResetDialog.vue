
<template>

  <v-dialog v-model="show" max-width="350px">
    <v-card>
      <v-card-title>
        <h4>Resetting Room...</h4>
        <v-btn small color="blue" @click.native="tmp">TMP</v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-list class="resetRoom" dense>
        <v-list-tile v-for="[dev, d] of Object.entries(this.devices)" :key="dev">
          <v-list-tile-content>{{d.name}}</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-icon :style="{ color: iconColor(d) }">check</v-icon>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider/>

        <v-list-tile style="padding-top:5px;">
          <v-list-tile-content class="align-end">
            Time Taken: {{runningTimePretty}}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-dialog>

</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      show: true,
      runningTime: 0,
      devices: {
        'clock':   { name: 'Clock',    received: false, reset: false },
        'quiz':    { name: 'Quiz',     received: false, reset: false },
        'bird':    { name: 'Birdcage', received: false, reset: false },
        'zoltar':  { name: 'Zoltar',   received: false, reset: false },
        'mummy':   { name: 'Mummy',    received: false, reset: false },
        'stairs':  { name: 'Stairs',   received: false, reset: false },
        'cabinet': { name: 'Cabinet',  received: false, reset: false }
      }
    }),
    computed: {
      runningTimePretty: function() {
        let m = Math.floor(this.runningTime / 60)
        let s = this.runningTime % 60

        m = m < 10 ? "0" + m : m
        s = s < 10 ? "0" + s : s

        return `${m}:${s}`
      }
    },
    created() {
      let now = undefined

      this.$root.$data.museumRoot.child('devices').on('value', (snapshot) => {
        let devices = snapshot.val()

        if (!now) {
          now = new Date()
        } else {
          for (const [dev, d] of Object.entries(devices)) {
             if (d.info && d.info.lastActivity) {
              let lastActivity  = new Date(d.info.lastActivity)
              let timeSince = lastActivity - now
              if (timeSince > 0) {
                this.devices[dev].reset = true
              }
            }
          }

          // special case quiz
          if (devices.quiz.force && devices.quiz.force == 4) {
            this.devices.quiz.received = true
          } 
          if (!devices.quiz.force && this.devices.quiz.received) {
            this.devices.quiz.reset = true
          }
        }

      })
    },
    mounted() {
      setInterval(() => {
        this.runningTime++;
      }, 1000)
    },
    methods: {
      iconColor: function(d) {
        if (d.reset) {
          return '#4CAF50'
        } else if(d.received) {
          return '#000000'
        } else {
          return '#BDBDBD'
        }
      },
      tmp: function() {
        // for (const [dev, d] of Object.entries(this.devices)) {
        // }
        this.resetDevice('zoltar')
      },
      resetDevice: function(dev) {
        let d = this.devices[dev]

        // special case quiz
        if (dev == 'quiz') {
          this.$root.$data.museumRoot.child('devices/quiz').update({
              force: 4
          });
        } else {
          this.operations.add({ command: `${dev}.reboot` }).on("value", (snapshot) => {
            if (snapshot.val().received) {
              d.received = true
            }
          });
        }
      }
    }
  }
</script>

<style scoped>
</style>


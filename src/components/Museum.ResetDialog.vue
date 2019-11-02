
<template>

  <v-dialog v-model="show" max-width="350px" :persistent="true">
    <v-card>
      <v-card-title>
        <h4>Resetting Room...</h4>
      </v-card-title>
      <v-divider></v-divider>

      <v-list class="resetRoom" dense>
        <v-list-tile v-for="[dev, d] of Object.entries(this.devices)" :key="dev">
          <v-list-tile-content>{{d.name}}</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-progress-circular v-if="!d.reset" size="18" indeterminate color="primary" style="margin-right: 5px;"></v-progress-circular>
            <v-icon v-else :style="{ color: iconColor(d) }">check</v-icon>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider/>

        <v-list-tile style="padding-top:15px;padding-bottom:10px;">
          <v-list-tile-content class="">
            Time Taken: {{runningTimePretty}}
          </v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-btn :disabled="buttonDisabled" small color="primary"  @click.native="$root.$emit('close-reset-dialog')">{{buttonText}}</v-btn>
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
      buttonText: "Resetting",
      buttonDisabled: true,
      work: [],
      devices: {
        'dashboard': { name: 'Dashboard', received: false, reset: false },
        'map':       { name: 'Map',       received: false, reset: false },
        'cabinet':   { name: 'Cabinet',   received: false, reset: false },
        'quiz':      { name: 'Quiz',      received: false, reset: false },
        'bird':      { name: 'Birdcage',  received: false, reset: false },
        'zoltar':    { name: 'Zoltar',    received: false, reset: false },
        'mummy':     { name: 'Mummy',     received: false, reset: false },
        'stairs':    { name: 'Stairs',    received: false, reset: false },
        'clock':     { name: 'Clock',     received: false, reset: false },
        'mausoleum': { name: 'Mausoleum', received: false, reset: false }
      }
    }),
    computed: {
      runningTimePretty: function() {
        let m = Math.floor(this.runningTime / 60)
        let s = this.runningTime % 60

        m = m < 10 ? "0" + m : m
        s = s < 10 ? "0" + s : s

        return `${m}:${s}`
      },
      completed: function() {
        let completed = true
        for (const [dev, d] of Object.entries(this.devices)) {
          completed = completed && d.reset
        }
        return completed
      }
    },
    watch: {
      completed (val) {
        if (val) {
          clearInterval(this.timer)
          this.buttonDisabled = false
          this.buttonText = "Done"
        }
      }
    },
    created() {
      let now = new Date()

      this.$root.$data.museumRoot.child('devices').on('value', (snapshot) => {
        let devices = snapshot.val()

        for (const [dev, d] of Object.entries(devices)) {
            if (d.info && d.info.lastActivity) {
              let lastActivity  = new Date(d.info.lastActivity)
              let timeSince = (lastActivity.getTime() + 5000) - now.getTime()
              if (timeSince > 0) {
                this.devices[dev].reset = true
              } else {
                //console.log(`${dev} ${timeSince}`)
              }
            }
          }
      })
    },
    mounted() {
      this.timer = setInterval(() => {
        this.runningTime++;
      }, 1000)

      // trigger reset all on load
      this.resetAll()
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
      runWork() {
        if (this.work.length == 0) return

        // run the work
        var workFunction = this.work.shift()
        workFunction()

        // schedule the next work
        setTimeout(this.runWork, 3000);
      },
      resetAll() {
        // reset the timer so it doesn't show
        this.work.push(() => {
          this.$root.$data.museumRoot.child('devices/dashboard').update({ hours:"-1", minutes:0, clue: -1, route: "home" }, () => {
            this.devices.dashboard.received = true
            this.devices.dashboard.reset = true
          })
        })

        // reset the map forced
        this.work.push(() => {
          this.$root.$data.museumRoot.child('devices/map').update({ force:false }, () => {
            this.devices.map.received = true
            this.devices.map.reset = true
          })
        })

        // reset all the devices
        for (const [dev, d] of Object.entries(this.devices)) {
          // ignore special case ones
          if (dev == 'dashboard' || dev == 'map') continue;

          this.work.push(this.resetDevice.bind(this, dev));
        }

        // start the work queue
        this.runWork()
      },
      resetDevice: function(dev) {
        let d = this.devices[dev]

        console.log(`reset ${dev}`)

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
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>


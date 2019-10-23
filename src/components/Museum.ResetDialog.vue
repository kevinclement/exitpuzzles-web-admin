
<template>

  <v-dialog v-model="show" max-width="350px" :persistent="true">
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
            <v-progress-circular v-if="d.received && !d.reset" size="18" indeterminate color="primary" style="margin-right: 5px;"></v-progress-circular>
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
      devices: {
        'clock':   { name: 'Clock',    received: false, reset: false },
        'quiz':    { name: 'Quiz',     received: false, reset: false },
        'bird':    { name: 'Birdcage', received: false, reset: false },
        'zoltar':  { name: 'Zoltar',   received: false, reset: false },
        'mummy':   { name: 'Mummy',    received: false, reset: false },
        'stairs':  { name: 'Stairs',   received: false, reset: false },
        'cabinet': { name: 'Cabinet',  received: false, reset: false, wentOffline:false }
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
      let now = undefined

      this.$root.$data.museumRoot.child('devices').on('value', (snapshot) => {
        let devices = snapshot.val()

        if (!now) {
          now = new Date()
        } else {
          for (const [dev, d] of Object.entries(devices)) {
            if (dev == 'cabinet') {
              continue;
            }

            if (d.info && d.info.lastActivity) {
              let lastActivity  = new Date(d.info.lastActivity)
              let timeSince = lastActivity - now
              if (timeSince > 0) {
                this.devices[dev].reset = true
              }
            }
          }

          // special case cabinet
          if (this.devices.cabinet.received && !devices.cabinet.info.isConnected) {
            this.devices.cabinet.wentOffline = true
          }
          if (this.devices.cabinet.wentOffline && devices.cabinet.info.isConnected) {
            // now its back online, so mark it rebooted
            this.devices.cabinet.reset = true

            // now trigger clock reboot
            if (!this.devices.clock.received) {
              this.resetDevice('clock')
            }
          }
        }

      })
    },
    mounted() {
      this.timer = setInterval(() => {
        this.runningTime++;
      }, 1000)
    },
    methods: {
      iconColor: function(d) {

        // special case cabinet
        if (d.name == 'Cabinet') {
          return d.reset       ? '#4CAF50' :
                 d.wentOffline ? '#000000' :
                                 '#BDBDBD'
        }

        if (d.reset) {
          return '#4CAF50'
        } else if(d.received) {
          return '#000000'
        } else {
          return '#BDBDBD'
        }
      },
      tmp: function() {
        this.resetAll();
      },
      resetAll() {
        for (const [dev, d] of Object.entries(this.devices)) {
          // special case clock since that will be handled when cabinet comes online
          if (dev == 'clock') {
            continue;
          }

          this.resetDevice(dev)
        }
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


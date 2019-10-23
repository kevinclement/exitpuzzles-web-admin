
<template>

  <v-dialog v-model="show" max-width="350px">
    <v-card>
      <v-card-title>
        <h4>Resetting Room...</h4>
      </v-card-title>
      <v-divider></v-divider>

      <v-list class="resetRoom" dense>
        <v-list-tile v-for="d in devices" :key="d.dev">
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
      devices: [
        { name: 'Clock',    reset: false, dev:'clock' },
        { name: 'Quiz',     reset: false, dev:'quiz' },
        { name: 'Birdcage', reset: false, dev:'bird' },
        { name: 'Zoltar',   reset: false, dev:'zoltar' },
        { name: 'Mummy',    reset: false, dev:'mummy' },
        { name: 'Stairs',   reset: false, dev:'stairs' },
        { name: 'Cabinet',  reset: false, dev:'cabinet' }
      ]
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
    mounted() {
      setInterval(() => {
        this.runningTime++;
      }, 1000)
    },
    methods: {
      iconColor: function(d) {
        if (d.reset) {
          return '#4CAF50'
        } else {
          return '#BDBDBD'
        }
      }
    }
  }
</script>

<style scoped>
</style>


<template>
  <v-container fluid>
      <v-layout row wrap>
        <v-flex xs2>
          <v-subheader>Stats for:</v-subheader>
        </v-flex>
        <v-flex xs6>
          <select style="padding:3px;">
            <option>week</option>
            <option>month</option>
            <option>year</option>
            <option>all time</option>
          </select>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex>
          <div>{{latest.started}}</div>
          <table border=1>
            <tr>
              <td>total questions:</td>
              <td>{{analytics.totalQuestions}}</td>
            </tr>
          </table>
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="runs"
        hide-actions
        class="elevation-1"
        style="width: 725px;"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.started }}</td>
          <td>
            <span style="width: 37px;display:inline-block;">
              {{progress(props.item)}}%
            </span>
            <div class="prog">
              <div class="progInner" :style="{ width: progWidth(progress(props.item)) }">&nbsp;</div>
            </div>
          </td>
          <td class="text-xs-right">{{clues(props.item)}}</td>
          <td class="text-xs-right">{{force(props.item)}}</td>
          <td class="text-xs-right">{{tomb(props.item)}}</td>
          <td class="text-xs-right">{{props.item.timeLeft}}</td>
        </template>
      </v-data-table>
      <v-layout row wrap>
        <v-flex xs6>
          <div>
          <v-btn small color="primary"  @click.native="createIt">create</v-btn>
          <v-btn small color="primary"  @click.native="event">event</v-btn>
          </div>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      runs:[],
      filter: undefined,
      headers: [
          { text: 'Date',      value: 'date',     sortable: false, align: 'left'  },
          { text: 'Progress',  value: 'progress', sortable: false                 },
          { text: 'Clues',     value: 'clues',    sortable: false, align: 'right' },
          { text: 'Force',     value: 'force',    sortable: false, align: 'right' },
          { text: 'Time Tomb', value: 'timeTomb', sortable: false, align: 'right' },
          { text: 'Time Left', value: 'timeLeft', sortable: false, align: 'right' }
      ]
    }
  },

  computed: {
    latest () {
      return this.$root.$data.museumRuns.getCurrent()
    },

    analytics() {
      let analytics = {
         totalQuestions: this.latest.quiz ? this.latest.quiz.totalAsked : 0
      }

      return analytics
    }
  },

  created () {
    this.runs = this.$root.$data.museumRuns.getRuns()
  },

  methods: {
    
    createIt() {
      this.$root.$data.museumRuns.createMock()
    },
    event() {
      this.$root.$data.museumRuns.add('myevent')
    },
    progress(run) {
      let totalEvents = 0
      let finishedEvents = 0
      for (const [name, event] of Object.entries(run.events)) {
        if (event.timestamp) {
          finishedEvents++
        }
        totalEvents++
      }

      return Math.floor((finishedEvents/totalEvents) * 100)
    },
    progWidth(percent) {
      let p = percent / 100;
      let width = 75 * p;

      return `${width}px`
    },
    clues(run) {
      return `${run.dashboard.clues} / ${run.dashboard.adhoc}`
    },
    force(run) {
      let force = 0
      for (const [name, event] of Object.entries(run.events)) {
        if (event.force) {
          force++
        }
      }
      return force
    },
    tomb(run) {
      if (run.events.cabinet && run.events.cabinet.timestamp) {
        let t = new Date(run.events.cabinet.timestamp)
        let s = new Date(run.started)
        let delta = t.getTime() - s.getTime()
        let minutes = Math.floor(delta / 1000 / 60)
        minutes = minutes < 10 ? '0' + minutes : minutes
        let seconds = Math.floor((delta - (1000 * 60 * minutes)) / 1000)
        seconds = seconds < 10 ? '0' + seconds : seconds

        return `${minutes}:${seconds}`
      } else {
        return ''
      }
    }
  },

  components: {
  }
}
</script>

<style scoped>
.prog {
  width: 75px;
  display:inline-block;
}
.progInner {
  display:inline-block;
  background:#66BB6A;
  border-radius:3px;
}
</style>

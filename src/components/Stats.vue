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
        :items="desserts"
        hide-actions
        class="elevation-1"
        style="width: 725px;"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.date }}</td>
          <td>
            <span style="width: 37px;display:inline-block;">
              {{ progress(props.item.progress) }}
            </span>
            <div class="prog">
              <div class="progInner" :style="{ width: progWidth(props.item.progress) }">&nbsp;</div>
            </div>
          </td>
          <td class="text-xs-right">{{ props.item.clues }}</td>
          <td class="text-xs-right">{{ props.item.force }}</td>
          <td class="text-xs-right">{{ props.item.timeTomb }}</td>
          <td class="text-xs-right">{{ props.item.timeLeft }}</td>
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
      ],
      desserts: [
        {
          date: '10/28/2019 1:03 PM',
          progress: "56",
          clues: 6,
          force: 2,
          timeTomb: '45:01',
          timeLeft: ''
        },
        {
          date: '10/28/2019 11:05 AM',
          progress: "66",
          clues: 9,
          force: 0,
          timeTomb: '52:32',
          timeLeft: ''
        },
        {
          date: '10/28/2019 3:10 PM',
          progress: "90",
          clues: 7,
          force: 3,
          timeTomb: '44:12',
          timeLeft: ''
        },
        {
          date: '10/29/2019 7:08 PM',
          progress: "100",
          clues: 3,
          force: 4,
          timeTomb: '33:45',
          timeLeft: '3:30'
        },
        {
          date: '10/29/2019 5:02 PM',
          progress: "77",
          clues: 9,
          force: 1,
          timeTomb: '41:21',
          timeLeft: ''
        },
        {
          date: '10/31/2019 9:06 PM',
          progress: "100",
          clues: 0,
          force: 4,
          timeTomb: '29:22',
          timeLeft: '0:22'
        },
        {
          date: '10/30/2019 3:05 PM',
          progress: "44",
          clues: 2,
          force: 5,
          timeTomb: '61:11',
          timeLeft: ''
        }
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
      this.$root.$data.museumRuns.create()
    },
    event() {
      this.$root.$data.museumRuns.add('myevent')
    },
    progress(percent) {
      let tb = ""
      let bars = Math.round(percent * 10)

      // fill with bars, the rest with spaces
      for (let i = 0; i<bars;i++) {
        tb += "-"
      }
      for (let i = bars; i<10;i++) {
        tb += "\u00A0"
      }

      return `${percent}%`
    },
    progWidth(percent) {
      let p = percent / 100;
      let width = 75 * p;

      return `${width}px`
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

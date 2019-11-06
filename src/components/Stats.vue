<template>
  <v-container fluid>
    <v-layout>
        <v-flex>
          <v-card class="statsCard">
              <v-card-title class="titleRow" style="">
                  <h3 class="headline">Stats for </h3>
                  <select v-model="filter">
                    <option>week</option>
                    <option>month</option>
                    <option>year</option>
                    <option>all time</option>
                  </select>
               </v-card-title>
              <v-card-text class="statsContent" style="padding:0px;">
                <table border=0 class="statsTable" style="padding-left: 18px;">
                  <tr>
                    <td>avg. clues:</td><td>{{avgClues}}</td>
                    <td class="fstLbl">total:</td><td class="fstVal">{{runs.length}}</td>
                  </tr>
                  <tr>
                    <td>avg. force:</td><td>{{avgForce}}</td>
                    <td class="fstLbl">completed:</td><td class="fstVal">{{completed}} ({{completedPercentage}}%)</td>
                  </tr>
                  <tr>
                    <td>avg. time added:</td><td>{{avgTimeAdded}}</td>
                    <td class="fstLbl">fastest:</td><td class="fstVal">{{fastest}}</td>
                  </tr>
                  <tr>
                    <td>avg. time left:</td><td>{{avgTimeLeft}}</td>
                  </tr>
                </table>

              </v-card-text>
              <v-card-text class="controlsRow">
                <v-data-table :headers="headers" :items="runs" hide-actions style="width:100%">
                  <template slot="items" slot-scope="props">
                    <td style="width:150px;">{{ prettyStarted(props.item.started) }}</td>
                    <td>
                      <span style="width: 37px;display:inline-block;">
                        {{progress(props.item)}}%
                      </span>
                      <v-tooltip bottom>
                        <div class="prog" slot="activator">
                          <div class="progInner" :style="{ width: progWidth(progress(props.item)) }">&nbsp;</div>
                        </div>
                        <table>
                          <tr v-for="[name, event] of Object.entries(props.item.events)" :key="name">
                            <td style="padding-right:20px;">{{name}}</td>
                            <td><v-icon style="color:#E0E0E0" v-if="event.timestamp && event.timestamp">done</v-icon></td>
                          </tr>
                        </table>
                      </v-tooltip>
                    </td>
                    <td class="text-xs-right">{{clues(props.item)}}</td>
                    <td class="text-xs-right">{{force(props.item)}}</td>
                    <td class="text-xs-right">{{tomb(props.item)}}</td>
                    <td class="text-xs-right">{{closed(props.item)}}</td>
                    <td class="text-xs-right">{{prettySeconds(props.item.timeAdded)}}</td>
                    <td class="text-xs-right">{{prettyTimeLeft(props.item.timeLeft,)}}</td>
                  </template>
                </v-data-table>
              </v-card-text>
          </v-card>
        </v-flex>
    </v-layout>

    <v-layout row wrap style="padding-top:20px;">
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
      filter: 'week',
      headers: [
          { text: 'Date',       value: 'date',      sortable: false, align: 'left'  },
          { text: 'Progress',   value: 'progress',  sortable: false                 },
          { text: 'Clues',      value: 'clues',     sortable: false, align: 'right' },
          { text: 'Force',      value: 'force',     sortable: false, align: 'right' },
          { text: 'Time Tomb',  value: 'timeTomb',  sortable: false, align: 'right' },
          { text: 'Closed',     value: 'closed',    sortable: false, align: 'right' },
          { text: 'Time Added', value: 'timeAdded', sortable: false, align: 'right' },
          { text: 'Time Left',  value: 'timeLeft',  sortable: false, align: 'right' }
      ]
    }
  },

  computed: {
    latest () {
      return this.$root.$data.museumRuns.getCurrent()
    },

    runs () {
      let now = new Date()
      let weekBack = now.getDay() == 0 ? 6 : now.getDay() - 1
      let daysBack = 
        this.filter == 'week' ? weekBack : 
        this.filter == 'month' ? 30 : 
        this.filter == 'year' ? 365 : -1

      let startDay = daysBack > 0 ? 
          this.getDaysBack(daysBack) : 
          new Date('1/1/1970')

      let runs = this.$root.$data.museumRuns.getRuns().filter((r) => {
        let d = new Date(r.started)
        return d.getTime() > startDay.getTime()
      })

      return runs
    },

    completed() {
      let completed = 0

      this.runs.forEach( (run) => {
        let perc = this.progress(run);
        if (perc == 100) {
          completed++
        }
      });

      return completed
    },

    completedPercentage() {
      if (this.runs.length == 0) {
        return 0
      }

      return Math.floor((this.completed/this.runs.length) * 100)
    },

    avgClues() {
      if (this.runs.length == 0) {
        return 0
      }

      let clues = 0
      let adhoc = 0
      this.runs.forEach( (run) => {
        clues += run.dashboard.clues
        adhoc += run.dashboard.adhoc
      });

      return `${Math.round(clues/this.runs.length)} / ${Math.round(adhoc / this.runs.length)}`
    },

    avgForce() {
      if (this.runs.length == 0) {
        return 0
      }

      let force = 0
      this.runs.forEach( (run) => {
        for (const [name, event] of Object.entries(run.events)) {
          if (event.force) {
            force++
          }
        }
      });

      return `${Math.round(force/this.runs.length)}`
    },

    avgTimeAdded() {
      if (this.runs.length == 0) {
        return 0
      }

      let timeAdded = 0
      this.runs.forEach( (run) => {
        timeAdded += run.timeAdded
      });

      return this.prettySeconds(Math.round(timeAdded / this.runs.length))
    },

    avgTimeLeft() {
      if (this.runs.length == 0) {
        return 0
      }

      let secondsLeft = 0
      let thoseWithTimeLeft = 0
      this.runs.forEach( (run) => {
        if (run.timeLeft != "") {
          let parts = run.timeLeft.split(':');
          let minutes = parseInt(parts[0])
          let seconds = parseInt(parts[1])
          secondsLeft += (minutes * 60) + seconds
          thoseWithTimeLeft++
        }
      });

      if (thoseWithTimeLeft > 0) {
        return this.prettySeconds(Math.round(secondsLeft / thoseWithTimeLeft), true)
      } else {
        return 0
      }
    },
    fastest(){
      if (this.runs.length == 0) {
        return 0
      }

      let fastest = 7200000
      this.runs.forEach( (run) => {
        if (run.finished && run.finished != "") {
          let s = new Date(run.started)
          let f = new Date(run.finished)
          let delta = f.getTime() - s.getTime()
          if (delta - fastest) {
            fastest = delta
          }
        }
      });

      return this.prettyHours(Math.floor(fastest / 1000))
    }
  },

  created () {
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
        let delta = (t.getTime() - s.getTime()) / 1000
        
        return this.prettySeconds(delta)
      } else {
        return ''
      }
    },
    closed(run) {
      if (run.closed && run.closed != '') {
        let s = new Date(run.started)
        let c = new Date(run.closed)
        let delta = (c.getTime() - s.getTime()) / 1000

        return this.prettyHours(delta, true)
      } else {
        return ''
      }
    },
    prettyStarted(started) {
      let year = (new Date()).getYear() + 1900
      let lastYear = year - 1

      return started.replace(`-${year}`, "")
                    .replace(`/${year},`, "")
                    .replace(`-${lastYear}`, "")
                    .replace(`/${lastYear},`, "")
    },
    prettyTimeLeft(tl) {
      if (tl == '') return ''

      let parts = tl.split(':');
      let minutes = parseInt(parts[0])
      let seconds = parseInt(parts[1])

      return this.prettySeconds((minutes * 60) + seconds, true)
    },

    prettyHours(s, showMinutes) {
      let hours = Math.floor(s / 60 / 60)
      let minutes = Math.floor((s - (60 * hours * 60)) / 60)

      let pretty = `${hours}h`
      if (showMinutes) {
        pretty += ` ${minutes}m`
      }

      return pretty
    },
    prettySeconds(s, showSeconds) {
      let minutes = Math.floor(s / 60)
      let seconds = Math.floor((s - (60 * minutes)))

      let pretty = `${minutes}m`
      if (showSeconds) {
        pretty += ` ${seconds}s`
      }

      return pretty
    },
    median(values) {
      values.sort( function(a,b) {return a - b;} );
      var half = Math.floor(values.length/2);

      if(values.length % 2)
        return values[half];
      else
        return (values[half-1] + values[half]) / 2.0;
    },
    getDaysBack(n) {
      let now = new Date()
      let m = now.getMonth() + 1
      let d = now.getDate()
      let y = now.getYear() + 1900
    
      let zeroHourToday = new Date(`${m}/${d}/${y}`)
      
      let timeToSubtract = n * 24 * 60 * 60 * 1000
      return new Date(zeroHourToday.getTime() - timeToSubtract)
    }
  },

  components: {
  }
}
</script>

<style scoped>
.titleRow, .controlsRow  {
  display: flex;
  flex-direction: row
}
.controlsRow {
  padding-top:12px;
}
.prog {
  width: 75px;
  display:inline-block;
}
.progInner {
  display:inline-block;
  background:#66BB6A;
  border-radius:3px;
}
.statsCard {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.statsCard select {
  height: 25px;
  border-style: solid;
  margin-left: 12px;
  -webkit-appearance: menulist;
  width: 85px;
}
.statsContent {
  display: flex;
  flex:1;
  font-family: monospace;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: .010em;
  line-height: 20px;
  position: relative;
}
.statsTable td:first-child {
  width: 135px;
}
.fstLbl {
  width:135px;
  padding-left: 50px;
}
</style>

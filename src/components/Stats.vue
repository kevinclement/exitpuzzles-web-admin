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
          <div>{{latest.date}}</div>
          <table border=1>
            <tr>
              <td>total questions:</td>
              <td>{{analytics.totalQuestions}}</td>
            </tr>
          </table>
        </v-flex>
      </v-layout>
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
      filter: undefined
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
    }
  },

  components: {
  }
}
</script>

<style scoped>
</style>

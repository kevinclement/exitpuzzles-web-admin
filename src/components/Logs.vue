<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout>
        <v-flex>
          <v-card height="100%" class="logCard">
            <v-card-title>
                <h3 class="headline">Logs from pi</h3>
            </v-card-title>
            <v-card-text class="logContent">
              <div class="scrollDiv">
                <div v-for="log in logs">
                  <span class="logLine">{{log.data}}</span>
                </div>
              </div>
            </v-card-text>
            <v-card-text>
              Logs {{logs.length}} from 11/25/16 1:10 PM to 11/25/16 1:14 PM
              <a @click="first()">first</a>
              <a @click="prev()">prev</a>
              <a @click="next()">next</a>
              <a @click="last()">last</a>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import Firebase from 'firebase'

// TODO: secrets are not checked in, is there a cleaner way to do this?
import config from '../../secrets/firebase-config'

// Initialize Firebase
let db = Firebase.initializeApp(config).database()
let logsRef = db.ref('logs').orderByChild("timestamp")

// TODO: REMOVE: only used for testing queries while developing
// --------------------------------------------------------------------
let queryTmp = db.ref('logs').orderByChild("timestamp").endAt("Mon Mar 19 2018 23:24:23 GMT-0700 (PDT)").limitToLast(1).on("child_added", function(snapshot) {
  console.log("tmp1: " + snapshot.key + " : " + snapshot.val().timestamp);
});

let queryTmp2 = db.ref('logs').orderByChild("timestamp").startAt("Tue Mar 20 2018 00:20:01 GMT-0700 (PDT)").limitToLast(1).on("child_added", function(snapshot) {
  console.log("tmp2: " + snapshot.key + " : " + snapshot.val().timestamp);
});
// --------------------------------------------------------------------

export default {

  data () {
    return {
      limit: 1,
      logs: [],
      lastTimestamp: null
    }
  },

  mounted() {
    // TODO: by default map to first log, probably should be last
    this.first();
  },

  methods: {
    setQuery(query) {
      // i <3 javascript
      let that = this;

      // hookup handler to process each item in the snapshot
      query.on("child_added", function(snapshot) {
        let log = snapshot.val()

        console.log(snapshot.key + " : " + log.timestamp + " : " + log.data)

        // store the timestamp so we can page off it
        that.lastTimestamp = log.timestamp
      })

      // bind it to vue
      this.$bindAsArray('logs', query)
    },

    first() {
      this.setQuery(logsRef.limitToFirst(this.limit));
    },

    last() {
      this.setQuery(logsRef.limitToLast(this.limit));
    },

    next() {
      // add 1 second to last timestamp to query the next set of data
      let qts = new Date(this.lastTimestamp);
      qts.setSeconds(qts.getSeconds() + 1);

      let query = logsRef.startAt(qts.toString()).limitToFirst(this.limit)
      this.setQuery(query);
    },

    prev() {
      // remove 1 second on last timestamp, then use limit to last with that end
      let qts = new Date(this.lastTimestamp);

      qts.setSeconds(qts.getSeconds() - 1);

      let query = logsRef.endAt(qts.toString()).limitToLast(this.limit)
      this.setQuery(query);
    }
  }
}

</script>

<style scoped>
.logSelect {
  padding: 0px;
}
.logLine {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.scrollDiv {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-left: 16px;
  padding-right: 16px;
  overflow-y: scroll;
}
.logCard {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logContent {
  display: flex;
  flex:1;
  background: black;
  color: white;
  font-family: monospace;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: .010em;
  line-height: 20px;
  position: relative;
}
</style>

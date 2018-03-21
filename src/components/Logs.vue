<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout>
        <v-flex>
          <v-card height="100%" class="logCard">
            <v-card-title class="titleRow">
                <h3 class="headline">Logs from pi</h3>
                <span class="spacer" />
                <a @click="showTimeStamps = !showTimeStamps">
                  <v-icon v-bind:title="timestampButtonTitle">{{timestampButtonIcon}}</v-icon></a>
            </v-card-title>
            <v-card-text class="logContent">
              <div class="scrollDiv">
                <div v-for="log in logs">
                  <span class="logLine">{{log.data}}</span>
                </div>
              </div>
            </v-card-text>
            <v-card-text class="controlsRow">
              <span>
                 Logs from {{firstTimestampStr}} to {{lastTimestampStr}}
              </span>
              <span class="spacer" />
              <span class="controls">
                <a @click="first()"><v-icon>first_page</v-icon></a>
                <a @click="prev()"><v-icon>chevron_left</v-icon></a>
                <a @click="next()"><v-icon>chevron_right</v-icon></a>
                <a @click="last()"><v-icon>last_page</v-icon></a>
              </span>
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
// let queryTmp = db.ref('logs').endAt("Mon Mar 19 2018 23:24:23 GMT-0700 (PDT)").limitToLast(1).on("child_added", function(snapshot) {
//   console.log("tmp1: " + snapshot.key + " : " + snapshot.val().timestamp);
// });

// let queryTmp2 = db.ref('logs').startAt("Tue Mar 20 2018 00:20:01 GMT-0700 (PDT)").limitToLast(1).on("child_added", function(snapshot) {
//   console.log("tmp2: " + snapshot.key + " : " + snapshot.val().timestamp);
// });
// --------------------------------------------------------------------

export default {
  firebase: {
    firstLog: db.ref('logs').limitToFirst(1),
    lastLog: db.ref('logs').limitToLast(1)
  },
  
  data () {
    return {
      limit: 1,
      logs: [],
      firstTimestamp: null,
      lastTimestamp: null,
      updating: false,
      showTimeStamps: false
    }
  },

  computed: {
    firstTimestampStr: function () {
      return formatDate(new Date(this.firstTimestamp))
    },
    lastTimestampStr: function () {
      return formatDate(new Date(this.lastTimestamp))
    },
    timestampButtonTitle: function() {
      return this.showTimeStamps ? "hide time stamps" : "show time stamps"
    },
    timestampButtonIcon: function() {
      return this.showTimeStamps ? "timer" : "timer_off"
    }
  },

  mounted() {
    // default should be to be on last page, which should enable streaming
    this.last();
  },

  methods: {
    setQuery(query) {
      // i <3 javascript
      let that = this;

      // hookup handler to process each item in the snapshot
      query.on("child_added", function(snapshot) {
        let log = snapshot.val()

        // track first item found
        if (that.updating) {
          that.updating = false
          that.firstTimestamp = log.timestamp
        }

        // TODO: comment out when shipping
        console.log(snapshot.key + " : " + log.timestamp + " : " + log.data)

        // store the timestamp so we can page off it
        that.lastTimestamp = log.timestamp
      })

      // bind it to vue
      this.updating = true
      this.$bindAsArray('logs', query)
    },

    first() {
      this.setQuery(logsRef.limitToFirst(this.limit));
    },

    last() {
      this.setQuery(logsRef.limitToLast(this.limit));
    },

    next() {
      // if we're at the end of the logs, ignore click
      if (this.lastTimestamp === this.lastLog[0].timestamp) {
        return;
      }

      // add 1 second to last timestamp to query the next set of data
      let qts = new Date(this.lastTimestamp);
      qts.setSeconds(qts.getSeconds() + 1);

      let query = logsRef.startAt(qts.toString()).limitToFirst(this.limit)
      this.setQuery(query);
    },

    prev() {

      // if we're at the beginning of the logs, ignore click
      if (this.lastTimestamp === this.firstLog[0].timestamp) {
        return;
      }

      // remove 1 second on last timestamp, then use limit to last with that end
      let qts = new Date(this.lastTimestamp);

      qts.setSeconds(qts.getSeconds() - 1);

      let query = logsRef.endAt(qts.toString()).limitToLast(this.limit)
      this.setQuery(query);
    }, 

    showHideTimeStamps() {

    }
  }
}

// Helper function to display nice dates
function formatDate(d) {
    let day = d.getDate();
    let month = d.getMonth() + 1; //Months are zero based
    let year = d.getFullYear();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    let amPM = "AM"

    if (hour === 0) {
      hour = 12;
    } else if (hour >= 12) {
      amPM = "PM"

      if (hour !== 12) {
        hour -= 12
      }
    }

    return month + "/" + day + "/" + year + " " + hour + ":" + minutes + " " + amPM;
}
</script>

<style scoped>
.titleRow, .controlsRow  {
  display: flex;
  flex-direction: row
}
.spacer {
  flex-basis: 0%;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0px;
}
.controls > a {
  padding-left: 10px;
  padding-right: 10px;
}
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

<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout>
        <v-flex>
          <v-card height="100%" class="logCard">
            <v-card-title class="titleRow">
                <h3 class="headline">Logs from pi</h3>
                <span class="spacer" />
                <v-btn icon @click="showTimeStamps = !showTimeStamps">
                  <v-icon v-bind:title="timestampButtonTitle">{{timestampButtonIcon}}</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="logContent">
              <div class="scrollDiv">
                <div v-for="log in logs">
                  <span v-if="showTimeStamps">{{formatLogDate(log.timestamp)}}</span>
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

export default {
  data () {
    return {
      logs: [],
      limit: 50 + 1,
      firstKey: null,
      lastKey: null,
      firstTime: null,
      lastTime: null,
      updating: false,
      showTimeStamps: false,
      logsRef: null
    }
  },

  computed: {
    firstTimestampStr: function () {
      return formatDate(new Date(this.firstTime))
    },
    lastTimestampStr: function () {
      return formatDate(new Date(this.lastTime))
    },
    timestampButtonTitle: function() {
      return this.showTimeStamps ? "hide time stamps" : "show time stamps"
    },
    timestampButtonIcon: function() {
      return this.showTimeStamps ? "timer" : "timer_off"
    }
  },

  mounted() {
    this.logsRef = this.$root.$data.fbdb.ref('logs').orderByKey()

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
          that.firstKey = snapshot.key
          that.firstTime = log.timestamp
        }

        // TODO: comment out when shipping
        console.log(snapshot.key + " : " + log.timestamp + " : " + log.data)

        // store the timestamp so we can page off it
        that.lastKey = snapshot.key
        that.lastTime = log.timestamp
      });

      // bind it to vue
      this.updating = true
      this.$bindAsArray('logs', query)
    },

    first() {
      this.setQuery(this.logsRef.limitToFirst(this.limit));
    },

    last() {
      this.setQuery(this.logsRef.limitToLast(this.limit));
    },

    next() {
      this.setQuery(this.logsRef.startAt(this.lastKey).limitToFirst(this.limit));
    },

    prev() {
      this.setQuery(this.logsRef.endAt(this.firstKey).limitToLast(this.limit));
    }, 

    formatLogDate(ts) {
      let d = new Date(ts)
      return "[" + d.toLocaleString() + "] "
    }
  }
}

// Helper functions to display nice dates
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

    return month + "/" + day + "/" + year + " " + hour + ":" + ("0" + minutes).substr(-2,2) + " " + amPM;
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

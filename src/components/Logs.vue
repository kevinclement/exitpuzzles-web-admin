<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout>
        <v-flex>
          <v-card height="100%" class="logCard">
            <v-card-title>
                <h3 class="headline">Logs from pi</h3>
                <v-btn @click="pageLogs()">button</v-btn>
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
let limit = 1
let app = Firebase.initializeApp(config)
let db = app.database()
let logsRef = db.ref('logs')
let query = logsRef.orderByChild("timestamp").limitToFirst(limit);
let lastTimestamp = null;

query.on("child_added", updateTime);

function updateTime(snapshot) {
  let log = snapshot.val();

  console.log(snapshot.key + " : " + log.timestamp + " : " + log.data);

  // bump last timestamp up 1 second so we can use it to filter 
  lastTimestamp = new Date(log.timestamp);
  lastTimestamp.setSeconds(lastTimestamp.getSeconds() + 1);
}

export default {
  firebase: {
    logs: query
  },

  data () {
    return {
    }
  },

  methods: {
    pageLogs() {

        var query2 = logsRef.orderByChild("timestamp").startAt(lastTimestamp.toString()).limitToFirst(limit)
        query2.on("child_added", updateTime)

        this.$bindAsObject('logs', query2);
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

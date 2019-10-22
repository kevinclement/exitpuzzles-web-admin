<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'clock')">Reboot</v-btn>
  </div>
  <div class="row" style="padding-top:15px;">
    <table border=0>
      <tr><td>1-1:</td><td class="ans"><span :class="getClass('1-1')">{{state['1-1']}}</span></td></tr>
      <tr><td>1-2:</td><td class="ans"><span :class="getClass('1-2')">{{state['1-2']}}</span></td></tr>
      <tr><td>1-3:</td><td class="ans"><span :class="getClass('1-3')">{{state['1-3']}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>2-1:</td><td class="ans"><span :class="getClass('2-1')">{{state['2-1']}}</span></td></tr>
      <tr><td>2-2:</td><td class="ans"><span :class="getClass('2-2')">{{state['2-2']}}</span></td></tr>
      <tr><td>2-3:</td><td class="ans"><span :class="getClass('2-3')">{{state['2-3']}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>3-1:</td><td class="ans"><span :class="getClass('3-1')">{{state['3-1']}}</span></td></tr>
      <tr><td>3-2:</td><td class="ans"><span :class="getClass('3-2')">{{state['3-2']}}</span></td></tr>
      <tr><td>3-3:</td><td class="ans"><span :class="getClass('3-3')">{{state['3-3']}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>4-1:</td><td class="ans"><span :class="getClass('4-1')">{{state['4-1']}}</span></td></tr>
      <tr><td>4-2:</td><td class="ans"><span :class="getClass('4-2')">{{state['4-2']}}</span></td></tr>
      <tr><td>4-3:</td><td class="ans"><span :class="getClass('4-3')">{{state['4-3']}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>5-1:</td><td class="ans"><span :class="getClass('5-1')">{{state['5-1']}}</span></td></tr>
      <tr><td>5-2:</td><td class="ans"><span :class="getClass('5-2')">{{state['5-2']}}</span></td></tr>
      <tr><td>5-3:</td><td class="ans"><span :class="getClass('5-3')">{{state['5-3']}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>6-1:</td><td class="ans"><span :class="getClass('6-1')">{{state['6-1']}}</span></td></tr>
      <tr><td>6-2:</td><td class="ans"><span :class="getClass('6-2')">{{state['6-2']}}</span></td></tr>
      <tr><td>6-3:</td><td class="ans"><span :class="getClass('6-3')">{{state['6-3']}}</span></td></tr>
    </table>
    <div style="padding-top: 20px;">
      {{stats.start}}
    </div>
    <div >
      connected: {{percentConnected}}%
    </div>
    
    
  </div>
</div>
</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      state: {
        "1-1": "",
        "1-2": "",
        "1-3": "",

        "2-1": "",
        "2-2": "",
        "2-3": "",

        "3-1": "",
        "3-2": "",
        "3-3": "",

        "4-1": "",
        "4-2": "",
        "4-3": "",

        "5-1": "",
        "5-2": "",
        "5-3": "",

        "6-1": "",
        "6-2": "",
        "6-3": ""
      },
      stats: {
        connects: 0,
        disconnects: 0,
        start: "",
        timeDisconnectedMS: 0
      }
    }),
    computed: {
      percentConnected: function() {
      
        if (this.stats.start == "") {
          return 0
        }

        var then = new Date(this.stats.start)
        var now = new Date()
        var totalMS = (now - then) * 18
        var totalConnected = totalMS - this.stats.timeDisconnectedMS
        var perc = (totalConnected / totalMS) * 100

        // just grab 2 decimal places
        var parts = perc.toString().split('.')
        var p1 = parts[0]
        var p2 = parts[1].substring(0,2)

        return `${p1}.${p2}`;
      }
    },
    created () {
      this.$root.$data.museumRoot.child('devices/bulbs').on('value', (snapshot) => {
        let bulb = snapshot.val()
        if (bulb == null) return

        if (bulb.stats) {
          this.stats.connects = bulb.stats.connects;
          this.stats.disconnects = bulb.stats.disconnects;
          this.stats.start = bulb.stats.start;
          this.stats.timeDisconnectedMS = bulb.stats.timeDisconnectedMS;
        }

        for (const [b, state] of Object.entries(bulb)) {
          this.state[b] = state
        }
      })
    },
    methods: {
      getClass(bulb) {
        let c = ''

        if (this.state[bulb] === 'connected') {
          c = 'yes'
        } else if (this.state[bulb] === 'connecting') {
          c = 'maybe'
        } else {
          c = 'no'
        }

        return c
      }
    }
  }
</script>

<style scoped>
  .row {
    padding-left:15px;
    padding-right: 15px;
    font-family: Monaco, monospace;
    font-size:16px;
  }
  .no, .yes, .maybe {
    display: inline-block;
    width: 125px;
    height: 22px;
    line-height: 22px;
    color: white;
    text-align: center;
  }
  .yes {
    background: green;
  }
  .no, .maybe{
    background: red;
  }
  .ans {
    padding-left:35px;
  }
  .rowPadding {
    padding-top:15px;
  }
</style>


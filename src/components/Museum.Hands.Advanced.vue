<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'hands')">Reboot</v-btn>
  </div>
  <div class="row" style="padding-top:15px;">
    <table border=0>
      <tr><td>1-1:</td><td class="ans"><span :class="getClass('1-1')">{{getColor(state['1-1'])}}</span></td></tr>
      <tr><td>1-2:</td><td class="ans"><span :class="getClass('1-2')">{{getColor(state['1-2'])}}</span></td></tr>
      <tr><td>1-3:</td><td class="ans"><span :class="getClass('1-3')">{{getColor(state['1-3'])}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>2-1:</td><td class="ans"><span :class="getClass('2-1')">{{getColor(state['2-1'])}}</span></td></tr>
      <tr><td>2-2:</td><td class="ans"><span :class="getClass('2-2')">{{getColor(state['2-2'])}}</span></td></tr>
      <tr><td>2-3:</td><td class="ans"><span :class="getClass('2-3')">{{getColor(state['2-3'])}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>3-1:</td><td class="ans"><span :class="getClass('3-1')">{{getColor(state['3-1'])}}</span></td></tr>
      <tr><td>3-2:</td><td class="ans"><span :class="getClass('3-2')">{{getColor(state['3-2'])}}</span></td></tr>
      <tr><td>3-3:</td><td class="ans"><span :class="getClass('3-3')">{{getColor(state['3-3'])}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>4-1:</td><td class="ans"><span :class="getClass('4-1')">{{getColor(state['4-1'])}}</span></td></tr>
      <tr><td>4-2:</td><td class="ans"><span :class="getClass('4-2')">{{getColor(state['4-2'])}}</span></td></tr>
      <tr><td>4-3:</td><td class="ans"><span :class="getClass('4-3')">{{getColor(state['4-3'])}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>5-1:</td><td class="ans"><span :class="getClass('5-1')">{{getColor(state['5-1'])}}</span></td></tr>
      <tr><td>5-2:</td><td class="ans"><span :class="getClass('5-2')">{{getColor(state['5-2'])}}</span></td></tr>
      <tr><td>5-3:</td><td class="ans"><span :class="getClass('5-3')">{{getColor(state['5-3'])}}</span></td></tr>

      <tr><td class="rowPadding"></td></tr>
      <tr><td>6-1:</td><td class="ans"><span :class="getClass('6-1')">{{getColor(state['6-1'])}}</span></td></tr>
      <tr><td>6-2:</td><td class="ans"><span :class="getClass('6-2')">{{getColor(state['6-2'])}}</span></td></tr>
      <tr><td>6-3:</td><td class="ans"><span :class="getClass('6-3')">{{getColor(state['6-3'])}}</span></td></tr>
    </table>    
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
      }
    }),
    computed: {
    },
    created () {
      this.$root.$data.museumRoot.child('devices/bulbs').on('value', (snapshot) => {
        let bulb = snapshot.val()
        if (bulb == null) return

        for (const [b, state] of Object.entries(bulb)) {
          this.state[b] = state
        }
      })
    },
    methods: {
      getClass(bulb) {
        let c = ''

        let sc = this.state[bulb].color
        if (sc === 'r') {
          c = 'r'
        } else if (this.state[bulb].color === 'g') {
          c = 'g'
        } else if (this.state[bulb].color === 'b') {
          c = 'b' 
        } else {
          c = 'w'
        }

        return c
      },
      getColor(bulb) {
        return bulb.color == "r" ? "red" : 
          bulb.color == "g" ? "green" : 
          bulb.color == "b" ? "blue" : 
           "white"
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
  .g, .r, .b, .w {
    display: inline-block;
    width: 125px;
    height: 22px;
    line-height: 22px;
    color: white;
    text-align: center;
  }
  .w {
    background:lightgray;
  }
  .g {
    background: green;
  }
  .r {
    background: red;
  }
  .b {
    background: blue;
  }
  .ans {
    padding-left:35px;
  }
  .rowPadding {
    padding-top:15px;
  }
</style>


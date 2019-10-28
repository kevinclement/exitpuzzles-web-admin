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
      <tr v-for="(bulb, index) in state" :key="bulb.name" :class="{ extraPadding:(index + 1) % 3 == 0 }">
        <td>{{bulb.name}}</td>
        <td class="ans"><span :class="getClass(bulb.state.color)">{{getColor(bulb.state.color)}}</span></td>
      </tr>
    </table>    
  </div>
</div>
</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      state: [],
    }),
    computed: {
    },
    created () {
      this.$root.$data.museumRoot.child('devices/bulbs').on('value', (snapshot) => {
        let bulb = snapshot.val()
        if (bulb == null) return

        this.state = [];
        for (const [b, state] of Object.entries(bulb)) {
          this.state.push({ name: b, state: state })
        }
      })
    },
    methods: {
      getClass(color) {
        return color == 'white' ? 'w' : color
      },
      getColor(color) {
        return color == "r" ? "red" : 
          color == "g" ? "green" : 
          color == "b" ? "blue" : 
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
  .extraPadding {
    vertical-align: top;
    height: 35px;
  }
</style>


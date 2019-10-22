<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="row" style="padding-top:15px;">
    <table border=0>
      <tr>
        <td>Fiji:</td><td class="ans"><span :class="fiji ? 'yes' : 'no'">{{boolToString(fiji)}}</span></td>
      </tr>
      <tr>
        <td>Madagascar:</td><td class="ans"><span :class="madagascar ? 'yes' : 'no'">{{boolToString(madagascar)}}</span></td>
      </tr>
      <tr>
        <td>Alaska:</td><td class="ans"><span :class="alaska ? 'yes' : 'no'">{{boolToString(alaska)}}</span></td>
      </tr>
      <tr>
        <td>India:</td><td class="ans"><span :class="india ? 'yes' : 'no'">{{boolToString(india)}}</span></td>
      </tr>
      <tr>
        <td>Seattle:</td><td class="ans"><span :class="seattle ? 'yes' : 'no'">{{boolToString(seattle)}}</span></td>
      </tr>
      <tr>
        <td>Spain:</td><td class="ans"><span :class="spain ? 'yes' : 'no'">{{boolToString(spain)}}</span></td>
      </tr>
      <tr>
        <td>Argentina:</td><td class="ans"><span :class="argentina ? 'yes' : 'no'">{{boolToString(argentina)}}</span></td>
      </tr>

      <tr>
        <td style="padding-top:25px;">Display:</td><td class="resCel" style="padding-top:25px;" >{{curImg}}</td>
      </tr>
      <tr>
        <td style="">Solved:</td><td class="resCel">{{solved}}</td>
      </tr>
    </table>
  </div>

</div>
</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      fiji: false,
      madagascar: false,
      alaska: false,
      india: false,
      seattle: false,
      spain: false,
      argentina: false,
      curImg: "Map",
      solved: false
    }),
    computed: {
    },
    created () {
      this.$root.$data.museumRoot.child('devices/map').on('value', (snapshot) => {
        let map = snapshot.val()
        if (map == null) return

        this.fiji = map.magnets.fiji
        this.madagascar = map.magnets.madagascar
        this.alaska = map.magnets.alaska
        this.india = map.magnets.india
        this.seattle = map.magnets.seattle
        this.spain = map.magnets.spain
        this.argentina = map.magnets.argentina

        this.curImg = map.image === "images/FINAL.bmp" ? "map" : "code"
        this.solved = map.solved
      })
    },
    methods: {
      boolToString(b) {
        return b ? "Yes" : "No"
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
  .no, .yes {
    display: inline-block;
    width: 36px;
    height: 22px;
    line-height: 22px;
    padding-left:5px;
    color: white;
  }
  .yes {
    background: green;
  }
  .no {
    background: red;
  }
  .ans {
    padding-left:35px;
  }
  .resCel {
    padding-left: 23px;
    text-align: end;
  }
</style>


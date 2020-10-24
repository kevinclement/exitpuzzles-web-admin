<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'map')">Reboot</v-btn>
  </div>

  <div class="row" style="padding-top:15px;">
    <table border=0>
      <tr>
        <td>Fiji:</td><td class="ans"><span :class="locToClass(fiji)">{{locToString(fiji)}}</span></td>
      </tr>
      <tr>
        <td>Madagascar:</td><td class="ans"><span :class="locToClass(madagascar)">{{locToString(madagascar)}}</span></td>
      </tr>
      <tr>
        <td>Alaska:</td><td class="ans"><span :class="locToClass(alaska)">{{locToString(alaska)}}</span></td>
      </tr>
      <tr>
        <td>India:</td><td class="ans"><span :class="locToClass(india)">{{locToString(india)}}</span></td>
      </tr>
      <tr>
        <td>Seattle:</td><td class="ans"><span :class="locToClass(seattle)">{{locToString(seattle)}}</span></td>
      </tr>
      <tr>
        <td>Spain:</td><td class="ans"><span :class="locToClass(spain)">{{locToString(spain)}}</span></td>
      </tr>
      <tr>
        <td>Argentina:</td><td class="ans"><span :class="locToClass(argentina)">{{locToString(argentina)}}</span></td>
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
      fiji:       { state: false, override: false },
      madagascar: { state: false, override: false },
      alaska:     { state: false, override: false },
      india:      { state: false, override: false },
      seattle:    { state: false, override: false },
      spain:      { state: false, override: false },
      argentina:  { state: false, override: false },

      curImg: "",
      solved: false
    }),
    computed: {
    },
    created () {
      this.$root.$data.museumRoot.child('devices/map').on('value', (snapshot) => {
        let map = snapshot.val()
        if (map == null) return

        this.fiji.state          = map.magnets.fiji
        this.fiji.override       = map.overrides.fiji
        this.madagascar.state    = map.magnets.madagascar
        this.madagascar.override = map.overrides.madagascar
        this.alaska.state        = map.magnets.alaska
        this.alaska.override     = map.overrides.alaska
        this.india.state         = map.magnets.india
        this.india.override      = map.overrides.india
        this.seattle.state       = map.magnets.seattle
        this.seattle.override    = map.overrides.seattle
        this.spain.state         = map.magnets.spain
        this.spain.override      = map.overrides.spain
        this.argentina.state     = map.magnets.argentina
        this.argentina.override  = map.overrides.argentina

        this.curImg = map.image
        this.solved = map.solved
      })
    },
    methods: {
      locToString(loc) {
        return loc.override ? "Force" : loc.state ? "Yes" : "No"
      },
      locToClass(loc) {
        return loc.override ? "force" : loc.state ? 'yes' : 'no'
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
  .no, .yes, .force {
    display: inline-block;
    width: 60px;
    height: 22px;
    line-height: 22px;
    padding-left:5px;
    color: white;
  }
  .yes {
    background: green;
  }
  .force {
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


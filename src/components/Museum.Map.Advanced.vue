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
    
      <tr v-for="loc in Object.keys(locations)" :key="loc">
        <td>{{ formatLocation(loc) }}:</td>
        <td class="ans">
          <span @click="clickToOverride(loc)" :class="locToClass(locations[loc])">{{locToString(locations[loc])}}</span>
        </td>
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
      locations: {
        fiji:       { state: false, override: false },
        madagascar: { state: false, override: false },
        alaska:     { state: false, override: false },
        india:      { state: false, override: false },
        seattle:    { state: false, override: false },
        spain:      { state: false, override: false },
        argentina:  { state: false, override: false },
      },
      
      curImg: "",
      solved: false
    }),
    computed: {
    },
    created () {
      this.$root.$data.museumRoot.child('devices/map').on('value', (snapshot) => {
        let map = snapshot.val()
        if (map == null) return

        Object.entries(this.locations).forEach(([loc, locObj]) => {
          locObj.state = map.magnets[loc];
          locObj.override = map.overrides[loc];
        });

        this.curImg = map.image
        this.solved = map.solved
      })
    },
    methods: {
      formatLocation(loc) {
        return loc.charAt(0).toUpperCase() + loc.slice(1);
      },
      locToString(loc) {
        return loc.override ? "Force" : loc.state ? "Yes" : "No"
      },
      locToClass(loc) {
        return loc.override ? "force" : loc.state ? 'yes' : 'no'
      },
      clickToOverride(loc) {
        console.log("overriding: " + loc);
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
    cursor: pointer;
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


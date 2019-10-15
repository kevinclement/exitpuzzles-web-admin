<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'cabinet')">Reboot</v-btn>
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
  .actionRow {
    padding-left:10px;
    padding-right: 10px;
    padding-top:15px;
    padding-bottom:10px;
  }
  .actionRow button {
    margin-top:0px;
    margin-bottom:0px;
  }
</style>


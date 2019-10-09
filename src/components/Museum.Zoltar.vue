M<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">person</v-icon>Zoltar
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>

      <!-- TODO: add feature to send user defined message 
      <v-btn flat icon color="grey" style="margin-left:0px;" @click.native="dialog = true"><v-icon>message</v-icon></v-btn>
      -->
      <v-btn :disabled="coins <= 0" flat icon class="actionButton" @click.native="decrement"><v-icon>remove</v-icon></v-btn>
      <v-btn :disabled="coins >= 3" flat icon class="actionButton" @click.native="increment"><v-icon>add</v-icon></v-btn>

      <span class="spacer" />

      <v-icon :color="coinColor(1)">monetization_on</v-icon>
      <v-icon :color="coinColor(2)">monetization_on</v-icon>
      <v-icon :color="coinColor(3)">monetization_on</v-icon>

      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'zoltar')">Reboot</v-btn>
    </v-toolbar>
  </v-card>  
</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations'],
    data: () => ({
      isConnected: true,
      solved: false,
      coins: 0,
      donations: 0,
    }),
    computed: {
      ocIcon() {
        return this.isOpened ? "arrow_back" : "arrow_forward"
      },
    },
    created () {
      this.$root.$data.museumRoot.child('devices/zoltar').on('value', (snapshot) => {
        let zoltar = snapshot.val()
        if (zoltar == null) return

        this.solved = zoltar.solved;
        this.coins = zoltar.coins;
        this.donations = zoltar.donations;
      })
    },
    methods: {
      increment() {
        this.operations.add({ command: 'zoltar.increment' }).on("value", (s) => {});
      },
      decrement() { 
        this.operations.add({ command: 'zoltar.decrement' }).on("value", (s) => {});
      },
      coinColor(i) {
        if (this.coins >= i) {
          return "grey darken-3"
        } else {
          return "grey lighten-2"
        }
      }
    }
  }
</script>

<style scoped>
.cardIcon {
  margin-bottom:3px;
  margin-left:7px;
  padding-right:10px;
}
.notConnected {
  color:red !important;
}
.actionButton {
  margin-left:0px;
  color: rgb(158,158,158) !important;
}
</style>

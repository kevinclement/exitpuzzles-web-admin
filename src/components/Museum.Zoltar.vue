M<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <span class="secTitle" @click="$root.$emit('show-details', 'zoltar')"><v-icon class="cardIcon">person</v-icon>Zoltar</span>
      </v-toolbar-title>

      <div v-if="isConnected">
        <v-btn :disabled="coins <= 0" flat icon class="actionButton" @click.native="decrement"><v-icon>remove</v-icon></v-btn>
        <v-btn :disabled="coins >= 3" flat icon class="actionButton" @click.native="increment"><v-icon>add</v-icon></v-btn>
        <v-btn flat icon class="actionButton" @click.native="printFeed" title="feed printer"><v-icon>print</v-icon></v-btn>
      </div>

      <span class="spacer" />

      <div class="status">
        <v-icon :color="coinColor(1)">monetization_on</v-icon>
        <v-icon :color="coinColor(2)">monetization_on</v-icon>
        <v-icon :color="coinColor(3)">monetization_on</v-icon>
      </div>

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
        this.isConnected = zoltar.info.isConnected;
      })
    },
    methods: {
      increment() {
        this.operations.add({ command: 'zoltar.increment' }).on("value", (s) => {});
      },
      decrement() { 
        this.operations.add({ command: 'zoltar.decrement' }).on("value", (s) => {});
      },
      printFeed() { 
        this.operations.add({ command: 'zoltar.printFeed' }).on("value", (s) => {
          if (s.val().received) {
            this.snack('Feed successful')
          }
        });
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
</style>

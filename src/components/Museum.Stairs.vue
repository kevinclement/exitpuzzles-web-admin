<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">line_weight</v-icon>Stairs
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
  
      <v-btn v-if="!isOpened" class="actionButton" flat icon @click.native="toggleUnsolvable" :title="usTitle"><v-icon>{{usIcon}}</v-icon></v-btn>
      <v-btn :disabled="level < 2" v-if="!isOpened" class="actionButton" flat icon @click.native="levelDown" title="level down"><v-icon>arrow_downward</v-icon></v-btn>
      <v-btn :disabled="level > 7" v-if="!isOpened" class="actionButton" flat icon @click.native="levelUp" title="level up"><v-icon>arrow_upward</v-icon></v-btn>
      <v-btn v-if="!isOpened" class="actionButton" flat icon @click.native="dialog = true" title="solve and open"><v-icon>emoji_events</v-icon></v-btn>
      <span class="spacer" />

      <span v-bind:class="{ notCompleted: level < 2 }" class="stairLevel">1</span>
      <span v-bind:class="{ notCompleted: level < 3 }" class="stairLevel">2</span>
      <span v-bind:class="{ notCompleted: level < 4 }" class="stairLevel">3</span>
      <span v-bind:class="{ notCompleted: level < 5 }" class="stairLevel">4</span>
      <span v-bind:class="{ notCompleted: level < 6 }" class="stairLevel">5</span>
      <span v-bind:class="{ notCompleted: level < 7 }" class="stairLevel">6</span>
      <span v-bind:class="{ notCompleted: level < 8 }" class="stairLevel">7</span>


      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'stairs')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really open the stairs?</v-card-title>
      <v-card-text>Are you sure you want to trigger opening the device?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="dialog = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="solved">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations'],
    data: () => ({
      isConnected: true,
      isOpened: false,
      dialog: false,
      unsolvable: false,
      level: 0,
    }),
    computed: {
      usTitle: function() {
        return this.unsolvable ? "make solvable" : "make unsolvable"
      },
      usIcon: function() {
        return this.unsolvable ? "report" : "report_off"
      }
    },
    created () {
      this.$root.$data.museumRoot.child('stairs').on('value', (snapshot) => {
        let stairs = snapshot.val()
        if (stairs == null) return

        this.isOpened = !stairs.magnet;
        this.level = stairs.level;
        this.unsolvable = stairs.unsolvable;
      })
    },
    methods: {
      toggleUnsolvable() {
        this.operations.add({ command: 'stairs.unsolvable' })
      },
      levelUp() {
        this.operations.add({ command: 'stairs.up' })
      },
      levelDown() {
        this.operations.add({ command: 'stairs.down' })
      },
      solved() {
        this.dialog = false

        this.operations.add({ command: 'stairs.drop' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Drop successfully.')
          }
        });

      },
    }
  }
</script>

<style scoped>
.cardIcon {
  margin-bottom:3px;
  margin-left:7px;
  padding-right:10px;
}
.actionButton{
  margin-left:0px;
  color: rgb(158,158,158);
}
.notConnected {
  color:red !important;
}
.stairLevel {
  border-radius: 20%;
  background: #8D6E63;
  height: 16px;
  width: 20px;
  margin: 2px;
  font-size:12px;
  line-height:16px;
  color: white;
  padding-left:6px;
}
.notCompleted {
  background: #e0e0e0 !important;
}
</style>
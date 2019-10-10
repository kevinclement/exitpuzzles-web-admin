M<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">account_balance</v-icon>Mausoleum
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>

      <v-btn flat icon class="actionButton" @click.native="toggleUnsolvable" :title="usTitle"><v-icon>{{usIcon}}</v-icon></v-btn>
      <v-btn flat icon class="actionButton" @click.native="failSound" title="send fail sound"><v-icon>thumb_down</v-icon></v-btn>
      <v-btn flat icon class="actionButton" @click.native="dialog = true" title="force solve"><v-icon>directions_run</v-icon></v-btn>

      <span class="spacer" />

      <v-icon :color="idolColor(idol_1, 1)" title="idol 1">{{idolIcon(idol_1)}}</v-icon>
      <v-icon :color="idolColor(idol_2, 2)" title="idol 2">{{idolIcon(idol_2)}}</v-icon>
      <v-icon :color="idolColor(idol_3, 3)" title="idol 3">{{idolIcon(idol_3)}}</v-icon>
      <v-icon :color="idolColor(idol_4, 4)" title="idol 4">{{idolIcon(idol_4)}}</v-icon>
      <v-icon :color="idolColor(idol_5, 5)" title="idol 5">{{idolIcon(idol_5)}}</v-icon>

      <v-btn flat small color="red lighten-3" @click.native="$emit('reboot-device', 'mausoleum')">Reboot</v-btn>
    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really open the final door?</v-card-title>
      <v-card-text>Are you sure you want to trigger opening the exit door?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="dialog = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="trigger">Yes</v-btn>
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
      isSolved: false,
      dialog: false,
      unsolvable: false,
      idol_1: false,
      idol_2: false,
      idol_3: false,
      idol_4: false,
      idol_5: false
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
      this.$root.$data.museumRoot.child('devices/mausoleum').on('value', (snapshot) => {
        let mausoleum = snapshot.val()
        if (mausoleum == null) return

        this.isSolved = mausoleum.solved;
        this.idol_1 = mausoleum.idol_1;
        this.idol_2 = mausoleum.idol_2;
        this.idol_3 = mausoleum.idol_3;
        this.idol_4 = mausoleum.idol_4;
        this.idol_5 = mausoleum.idol_5;
        this.unsolvable = mausoleum.unsolvable;
      })
    },
    methods: {
      idolColor(state, idol) {
        if (state) {
          let color = 
            idol == 1 ? "grey" :
            idol == 2 ? "blue" :
            idol == 3 ? "red" :
            idol == 4 ? "purple" :
                        "green"

          return color + " lighten-1"
        } else {
          return "grey lighten-1"
        }
      },
      idolIcon(state) {
        return state ? "check_circle" : "donut_large"
      },
      trigger() {
        this.dialog = false
        this.operations.addWithToast('mausoleum.solve', this.snack('Opened successfully'))
      },

      failSound() {
        this.operations.addWithToast('mausoleum.failSound', this.snack('Sent failed sound'))
      },

      toggleUnsolvable() {
        this.operations.addWithToast('mausoleum.unsolvable', this.snack('Toggled unsolvable'))
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
.notConnected {
  color:red !important;
}
.actionButton {
  margin-left:0px;
  color: rgb(158,158,158) !important;
}
</style>

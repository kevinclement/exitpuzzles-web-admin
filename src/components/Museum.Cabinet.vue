<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <span class="secTitle" @click="$root.$emit('show-details', 'cabinet')"><v-icon class="cardIcon">meeting_room</v-icon>Cabinet</span>
      </v-toolbar-title>

      <v-btn v-if="isConnected && !solved" flat icon class="actionButton" @click.native="dialog = true" title="open cabinet"><v-icon>lock</v-icon></v-btn>

      <span class="spacer" />

      <div class="status">
        <span v-bind:style="{ background: idolColors[idol] }" class="lightDot"/>
      </div>

    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really open the cabinet?</v-card-title>
      <v-card-text>Are you sure you want to trigger opening the cabinet?</v-card-text>
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
      solved: false,
      idol: 0,
      dialog: false,
      idolColors: [
        "#e0e0e0",
        "#bdbdbd",
        "#42a5f5",
        "#ef5350",
        "#ab47bc",
        "#66bb6a"
      ]
    }),
    created () {
      this.$root.$data.museumRoot.child('devices/cabinet').on('value', (snapshot) => {
        let cabinet = snapshot.val()
        if (cabinet == null) return

        this.solved = cabinet.solved
        this.idol = cabinet.idol
        this.isConnected = cabinet.info.isConnected
      })

    },
    methods: {
      trigger() {
        this.dialog = false

        this.operations.add({ command: 'cabinet.open' }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Opened successfully.')
          }
        });

      },
    }
  }
</script>

<style scoped>
.lightDot {
  border-radius: 50%;
  height: 16px;
  width: 16px;
  margin: 2px;
}
</style>

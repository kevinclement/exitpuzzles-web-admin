<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">dvr</v-icon>Quiz
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>

      <v-btn icon class="actionButton" @click.native="diag('INSERT DISK', 0)" title="insert disk"><v-icon>save</v-icon></v-btn>
      <v-btn icon class="actionButton" @click.native="diag('QUIZ', 1)" title="quiz"><v-icon>list</v-icon></v-btn>
      <v-btn icon class="actionButton" @click.native="diag('PASSWORD', 2)" title="password"><v-icon>security</v-icon></v-btn>
      <v-btn icon class="actionButton" @click.native="diag('JOURNAL', 3)" title="journal"><v-icon>menu_book</v-icon></v-btn>

      <span class="spacer" />

    </v-toolbar>
  </v-card>

  <v-dialog v-model="dialog" max-width="410">
    <v-card>
      <v-card-title class="headline">Really change screen?</v-card-title>
      <v-card-text>Are you sure you want to change to screen {{dialogTitle}}?</v-card-text>
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
      state: "",
      dialog: false,
      dialogTitle: '',
      dialogForce: -1,
      force: -1,
    }),
    created () {
      // INSERT_DISK, LAUNCH, QUIZ, PASSWORD, JOURNAL
      this.$root.$data.museumRoot.child('devices/quiz').on('value', (snapshot) => {
        let qz = snapshot.val()
        if (qz == null) return

        this.state = qz.state
        this.force = qz.force
      })
    },
    methods: {
      diag(title, force) {
        this.dialogTitle = title
        this.dialogForce = force
        this.dialog = true
      },

      trigger() {
        this.dialog = false

        this.$root.$data.museumRoot.child('devices/quiz').update({
          force: this.dialogForce
        });

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
.actionButton, .actionButtonBold {
  margin-left:0px;
  color: rgb(158,158,158);
}
.actionButtonBold {
  color: inherit;
}
</style>

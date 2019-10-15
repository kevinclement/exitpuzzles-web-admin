<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <span class="secTitle" @click="$root.$emit('show-details', 'quiz')"><v-icon class="cardIcon">dvr</v-icon>Quiz</span>
      </v-toolbar-title>

      <div v-if="isConnected">
        <v-btn icon class="actionButton" @click.native="diag('INSERT DISK', 0)" title="insert disk"><v-icon>save</v-icon></v-btn>
        <v-btn icon class="actionButton" @click.native="diag('QUIZ', 1)" title="quiz"><v-icon>list</v-icon></v-btn>
        <v-btn icon class="actionButton" @click.native="diag('PASSWORD', 2)" title="password"><v-icon>security</v-icon></v-btn>
        <v-btn icon class="actionButton" @click.native="diag('JOURNAL', 3)" title="journal"><v-icon>menu_book</v-icon></v-btn>
      </div>

      <span class="spacer" />
      <span class="results">
      {{currentQuestion}}/{{total}}
      missed: {{missed.length}}
      </span>

      <v-btn v-if="isConnected" flat small color="blue-grey lighten-3" @click.native="$root.$emit('show-details', 'quiz')">Advanced</v-btn>
      <v-btn v-if="isConnected" flat small color="red lighten-3" @click.native="dialogReset = true">Reboot</v-btn>
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
  
  <v-dialog v-model="dialogReset" max-width="410">
    <v-card>
      <v-card-title class="headline">Really reset the quiz?</v-card-title>
      <v-card-text>This will clear the state and reset it to title screen.  Are you <i>sure</i> you want to do that?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="dialogReset = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerReset">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations', 'isConnected'],
    data: () => ({
      state: "",
      dialog: false,
      dialogTitle: '',
      dialogForce: -1,
      force: -1,
      missed: [],
      correct: [],
      total: 0,
      dialogReset: false,
      currentQuestion: 0,
    }),
    created () {
      // INSERT_DISK, LAUNCH, QUIZ, PASSWORD, JOURNAL
      this.$root.$data.museumRoot.child('devices/quiz').on('value', (snapshot) => {
        let qz = snapshot.val()
        if (qz == null) return

        this.state = qz.state
        this.force = qz.force
        this.missed = qz.missedQuestions || []
        this.correct = qz.correctQuestions || []
        this.total = qz.total
        this.currentQuestion = qz.questionIndex + 1
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

      },

      triggerReset() {
        this.dialogReset = false

        this.$root.$data.museumRoot.child('devices/quiz').update({
          force: 4
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
  padding-right:0px;
}
.actionButton {
  margin-left:0px;
  margin-right:4px;
  color: rgb(158,158,158) !important;
}
.results {
  font-family: Monaco, monospace;
  font-size:16px;
}
</style>

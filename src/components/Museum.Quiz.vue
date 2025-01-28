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
        <v-btn icon class="actionButton" @click.native="diag('QUIZ', 1)" title="quiz"><v-icon>rule</v-icon></v-btn>
        <v-btn icon class="actionButton hideIfReallyNarrow" @click.native="diag('PASSWORD', 2)" title="password"><v-icon>password</v-icon></v-btn>
        <v-btn icon class="actionButton" @click.native="diag('JOURNAL', 3)" title="journal"><v-icon>menu_book</v-icon></v-btn>
        <v-btn icon class="actionButton" @click.native="diag('SUCCESS', 6)" title="success"><v-icon>celebration</v-icon></v-btn>
      </div>

      <span class="spacer" />
      <span class="results status">
        {{currentQuestion}}/{{total}}
        missed: {{missed.length}}
      </span>

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
        this.total = qz.currentTotal || 0
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

      }
    }
  }
</script>

<style scoped>
.results {
  font-family: Monaco, monospace;
  font-size:16px;
}
</style>

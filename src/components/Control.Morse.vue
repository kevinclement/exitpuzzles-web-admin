<template>
<v-flex>
  <!-- add/edit/adhoc dialog -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ form.title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field maxlength="16" label="Line 1" v-model="form.clue.line1"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field maxlength="16" label="Line 2" v-model="form.clue.line2"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-checkbox label="Error Clue" v-model="form.clue.errorType"></v-checkbox>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="save">{{saveSendTxt}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- confirm dialog -->
  <v-dialog v-model="confirmDiag" max-width="410">
    <v-card>
      <v-card-title class="headline">{{confirm.title}}</v-card-title>
      <v-card-text>{{confirm.text}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="confirmDiag = false">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="confirmed">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- morse code -->
  <v-card class="morseCard">
    <v-toolbar card>
      <v-toolbar-title>Morse Code
        <v-icon v-if="!isConnected" class="notConnected" title="Device disconnected">report_problem</v-icon></v-toolbar-title>
      <span class="spacer" />
      <v-btn icon title="Send a message" @click.native="adhocForm"><v-icon >message</v-icon></v-btn>
    </v-toolbar>

    <control-morse-category 
      title="Pre-solved"
      :editForm="editForm"
      :confirm="confirmForm"
      :send="send"
      :clueRef="presolvedRef"></control-morse-category>

  </v-card>
</v-flex>
</template>

<script>
  import MorseCategory from '@/components/Control.Morse.Category'

  export default {
    props: ['snack'],
    data: () => ({
      form: {
        title: '',
        clue: { line1: '', line2: '', errorType: false },
        callback: null
      },
      confirm: {
        title: '',
        text: ''
      },
      confirmCallback: null,
      presolvedRef: null,
      operationsRef: null,
      ios: false,
      adhoc: false,
      dialog: false,
      confirmDiag: false,
      isConnected: true
    }),
    computed: {
      saveSendTxt () {
        return this.adhoc ? 'Send' : 'Save'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    created () {
      this.ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

      this.operations = this.$root.$data.operations
      this.presolvedRef = this.$root.$data.fbdb.ref('morse/clues/1/clues')

      this.$root.$data.fbdb.ref('morse').child('isConnected').on('value', (snapshot) => {
        let isConnected = snapshot.val()
        if (isConnected == null) return
        this.isConnected = isConnected
      })
    },
    methods: {
      editForm(form) {
        this.form = form
        this.dialog = true
      },
      adhocForm() {
        this.form.title = 'Send Clue'
        this.adhoc = true
        this.dialog = true
      },
      confirmForm(isDelete, callback) {
        if (isDelete) {
          this.confirm.title = 'Really delete the clue?'
          this.confirm.text  = 'Are you sure you want permanently remove the clue from the system?'
        } else {
          this.confirm.title = 'Send the clue?'
          this.confirm.text  = 'Are you sure you want to send the clue to the device?'
        }

        this.confirmDiag = true
        this.confirmCallback = callback
      },
      confirmed() {
        this.confirmDiag = false
        this.confirmCallback()
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.adhoc = false
          this.form.title = this.form.clue.line1 = this.form.clue.line2 = ''
          this.form.clue.errorType = false
        }, 300)
      },
      save () {
        this.form.clue.errorType = this.form.clue.errorType ? true : false;

        if (this.adhoc) {
          this.send(this.form.clue, true)
        } else {
          this.form.callback(this.form.clue)
        }

        this.close()
      },
      send(clue, adhoc) {
        let sendOp = () => {
          this.operations.add({ command: 'clue', clue: clue }).on("value", (snapshot) => {
            let command = snapshot.val()
            if (command.received) {
              // pop snack letting user know  we triggered it
              this.snack('Clue sent successfully.')
              // disable further update notifications
              snapshot.ref.off()
            }
          });
        }

        if (adhoc) {
          sendOp()
        } else {
          this.confirmForm(false, sendOp);
        }
      },

    },

    components: {
      'control-morse-category': MorseCategory
    }
  }
</script>

<style scoped>
.morseCard {
  margin-top: 30px;
}
.notConnected {
  margin-bottom:4px;
  margin-left:7px;
  color:red
}
</style>

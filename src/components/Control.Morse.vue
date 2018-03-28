<template>
 
<v-flex>
  <!-- add/edit/adhoc dialog -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field maxlength="16" label="Line 1" v-model="editedClue.line1"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field maxlength="16" label="Line 2" v-model="editedClue.line2"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-checkbox
                    label="Error Clue"
                    v-model="editedClue.errorType"
                   ></v-checkbox>
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

  <!-- confirm delete dialog -->
  <v-dialog v-model="clueDiag" max-width="410">
    <v-card>
      <v-card-title class="headline">Really delete the clue?</v-card-title>
      <v-card-text>Are you sure you want permanently remove the clue from the system?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="clueDiag = false">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="deleteClue">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- send confirm dialog -->
  <v-dialog v-model="clueSendDiag" max-width="410">
    <v-card>
      <v-card-title class="headline">Send the clue?</v-card-title>
      <v-card-text>Are you sure you want to send the clue to the device?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="clueSendDiag = false">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="sendClue">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- morse code -->
  <v-card class="morseCard">
    <v-toolbar card>
      <v-toolbar-title>Morse Code</v-toolbar-title>
      <span class="spacer" />

      <v-btn icon title="Send a message" @click.native="adhocSend"><v-icon >message</v-icon></v-btn>
    </v-toolbar>

    <v-card-text class="grey lighten-3 ">
      <v-subheader >
        Pre-solved Clues
        <span class="spacer" />
        <v-btn icon title="Edit messages" @click.native="timeType = 'pre'; editPre = !editPre"><v-icon >edit</v-icon></v-btn>
        <v-btn icon title="Add a message" @click.native="timeType = 'pre'; dialog=true"><v-icon>add</v-icon></v-btn>
      </v-subheader>
      <div class="elevation-1">
        <table class="datatable table">
          <tbody>
            <tr class="clueRow" :class="{ clueRowIos: ios }" v-for="clue in preClues">
              <td>
                <a v-if="editPre" @click="editItem(clue)">{{ clue.line1 }}<br/>{{ clue.line2 }}</a>
                <span v-if="!editPre">{{ clue.line1 }}<br/>{{ clue.line2 }}</span>
              </td>
              <td class="text-xs-right ">
                <v-btn v-if="editPre" icon class="mx-0" @click="clueDiag = true; clueToDelete = clue">
                  <v-icon  color="red lighten-1">delete</v-icon>
                </v-btn>
                <v-btn v-if="!editPre" icon class="mx-0" @click="clueSendDiag = true; clueToSend = clue">
                  <v-icon :color="chatColor(clue.errorType)">{{chatIcon(clue.errorType)}}</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

      <v-subheader style="margin-top:20px" >
          Post-solved Clues
          <span class="spacer" />
          <v-btn icon title="Edit messages" @click.native="timeType = 'post'; editPost = !editPost"><v-icon >edit</v-icon></v-btn>
          <v-btn icon title="Add a message" @click.native="timeType = 'post'; dialog=true"><v-icon>add</v-icon></v-btn>
        </v-subheader>

        <div class="elevation-1">
        <table class="datatable table">
          <tbody>
            <tr class="clueRow" :class="{ clueRowIos: ios }" v-for="clue in preClues">
              <td>
                <a v-if="editPost" @click="editItem(clue)">{{ clue.line1 }}<br/>{{ clue.line2 }}</a>
                <span v-if="!editPost">{{ clue.line1 }}<br/>{{ clue.line2 }}</span>
              </td>
              <td class="text-xs-right ">
                <v-btn v-if="editPost" icon class="mx-0" @click="clueDiag = true; clueToDelete = clue">
                  <v-icon  color="red lighten-1">delete</v-icon>
                </v-btn>
                <v-btn v-if="!editPost" icon class="mx-0" @click="clueSendDiag = true; clueToSend = clue">
                  <v-icon :color="chatColor(clue.errorType)">{{chatIcon(clue.errorType)}}</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </v-card-text>

  </v-card>
</v-flex>

</template>

<script>
  export default {
    props: ['snack'],
    data: () => ({
      morseCluesPreRef: null,
      morseCluesPostRef: null,
      operationsRef: null,
      ios: false,
      adhoc: false,
      confirmDeleteDiag: false,
      clueSendDiag: false,
      clueToSend: null,
      dialog: false,
      timeType: null,
      editPre: false,
      editPost: false,
      preClues: [],
      clueDiag: false,
      clueToDelete: null,
      editedIndex: -1,
      editedClue: {
        line1: '',
        line2: '',
        errorType: false
      },
      defaultItem: {
        line1: '',
        line2: '',
        errorType: false
      }
    }),
    computed: {
      formTitle () {
        let timeTypeStr = this.timeType === 'pre' ? 'Pre-Solved' : 'Post-Solved'
        if (this.adhoc) {
          return 'Send ' + timeTypeStr + ' Clue';
        } else {
          return this.editedIndex === -1 ? 'New ' + timeTypeStr + ' Clue' : 'Edit ' + timeTypeStr + ' Clue'
        }
      },
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

      this.morseCluesPreRef = this.$root.$data.fbdb.ref('morse/cluesPre')
      this.morseCluesPostRef = this.$root.$data.fbdb.ref('morse/cluesPost')
      this.operationsRef = this.$root.$data.fbdb.ref('operations')

      this.morseCluesPreRef.on('child_added', (snapshot) => {
        let clue = snapshot.val()
        this.preClues.push({'id':snapshot.key, ...clue})
      })

      this.morseCluesPreRef.on('child_changed', (snapshot) => {
        let clue = snapshot.val()
        let aClue = this.preClues.find((clue) => {
          return clue.id === snapshot.key;
        })

        aClue.line1 = clue.line1;
        aClue.line2 = clue.line2;
        aClue.errorType = clue.errorType;
      });

      this.morseCluesPreRef.on('child_removed', (snapshot) => {

        this.preClues = this.preClues.filter((clue) => {
          return clue.id !== snapshot.key;
        })
      });

    },
    methods: {
      chatIcon (error) {
        return error ? 'announcement' : 'chat_bubble'
      },
      chatColor (error) {
        return error ? 'red lighten-1' : 'blue accent-1'
      },
      editItem (clue) {
        this.editedIndex = this.preClues.indexOf(clue)
        this.editedClue = Object.assign({}, clue)
        this.dialog = true
      },
      sendClue () {
        this.clueSendDiag = false;
        this.clueToSend = null;

        this.operationsRef.push({ command: 'clue' }).on("value", (snapshot) => {
          let command = snapshot.val()

          if (command.received) {

            // pop snack letting user know  we triggered it
            this.snack('Clue sent successfully.')

            // disable further update notifications
            snapshot.ref.off()
          }
        });
      },
      adhocSend() {
        this.adhoc = true
        this.dialog = true
      },
      deleteClue() {
        let id = this.clueToDelete.id;

        this.clueToDelete = null;
        this.clueDiag = false;

        // tell firedb to remove clue
        this.morseCluesPreRef.child(id).remove();
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedClue = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.adhoc = false
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          this.morseCluesPreRef.child(this.editedClue.id).set({ line1: this.editedClue.line1, line2: this.editedClue.line2, errorType: this.editedClue.errorType})
        } else if (this.adhoc) {
          this.clueToSend = this.editedClue
          this.sendClue()
        } else {
          this.morseCluesPreRef.push(this.editedClue)
        }
        this.close()
      }
    }
  }
</script>

<style scoped>
.morseCard {
  margin-top: 30px;
}

.clueRow {
  user-select: none;
}
.clueRowIos {
  background: #fff !important;
}

</style>

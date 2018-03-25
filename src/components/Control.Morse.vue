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
              <v-text-field maxlength="16" label="Line 1" v-model="editedItem.line1"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field maxlength="16" label="Line 2" v-model="editedItem.line2"></v-text-field>
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
      <v-btn icon title="Edit messages" @click.native="editMode = !editMode"><v-icon >edit</v-icon></v-btn>
      <v-btn icon title="Add a message" @click.native="dialog=true"><v-icon>add</v-icon></v-btn>
    </v-toolbar>

    <v-card-text class="grey lighten-3 ">
      <div class="elevation-1">
        <table class="datatable table">
          <tbody>
            <tr class="clueRow" :class="{ clueRowIos: ios }" v-for="item in items">
              <td>
                <a v-if="editMode" @click="editItem(item)">{{ item.line1 }}<br/>{{ item.line2 }}</a>
                <span v-if="!editMode">{{ item.line1 }}<br/>{{ item.line2 }}</span>
              </td>
              <td class="text-xs-right ">
                <v-btn v-if="editMode" icon class="mx-0" @click="clueDiag = true; clueToDelete = item">
                  <v-icon  color="red lighten-1">delete</v-icon>
                </v-btn>
                <v-btn v-if="!editMode" icon class="mx-0" @click="clueSendDiag = true; clueToSend = item">
                  <v-icon  color="blue accent-1">announcement</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card-text>

  </v-card>
</v-flex>

</template>

<script>
  export default {
    data: () => ({
      morseCluesRef: null,
      ios: false,
      adhoc: false,
      confirmDeleteDiag: false,
      clueSendDiag: false,
      clueToSend: null,
      dialog: false,
      editMode: false,
      items: [],
      clueDiag: false,
      clueToDelete: null,
      editedIndex: -1,
      editedItem: {
        line1: '',
        line2: ''
      },
      defaultItem: {
        line1: '',
        line2: ''
      }
    }),
    computed: {
      formTitle () {
        if (this.adhoc) {
          return 'Send Clue';
        } else {
          return this.editedIndex === -1 ? 'New Clue' : 'Edit Clue'
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

      this.morseCluesRef = this.$root.$data.fbdb.ref('morse/clues')

      let that = this
      this.morseCluesRef.on('child_added', function(data) {
        let clue = data.val()
        that.items.push({'id':data.key, ...clue})
      })

      this.morseCluesRef.on('child_changed', function(data) {
        let clue = data.val()
        let aClue = that.items.find((clue) => {
          return clue.id === data.key;
        })

        aClue.line1 = clue.line1;
        aClue.line2 = clue.line2;
      });

      this.morseCluesRef.on('child_removed', function(data) {
        that.items = that.items.filter((clue) => {
          return clue.id !== data.key;
        })
      });

    },
    methods: {
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      sendClue (item) {
        console.log('sending clue' + this.clueToSend.line1 + ' ' + this.clueToSend.line2);

        this.clueSendDiag = false;
        this.clueToSend = null;
      },
      adhocSend() {
        this.adhoc = true
        this.dialog = true
      },
      deleteClue() {
        console.log('deleting ' + this.clueToDelete.line1 + ' ' + this.clueToDelete.line2);
        this.clueToDelete = null;
        this.clueDiag = false;
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.adhoc = false
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else if (this.adhoc) {
          // NOOP for now
        } else {
          this.items.push(this.editedItem)
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

<template>
    <v-card-text class="grey lighten-3 ">
      <v-subheader >
        <div class="header" @click="headerExpCol"><v-icon>{{ headerIcon }}</v-icon> {{ title }} Clues</div>
        <span class="spacer" />
        <v-btn icon title="Edit messages" @click.native="editMode = !editMode"><v-icon >edit</v-icon></v-btn>
        <v-btn icon title="Add a message" @click.native="add"><v-icon>add</v-icon></v-btn>
      </v-subheader>
      <div class="elevation-1" v-if="expanded">
        <table class="datatable table">
          <tbody>
            <tr class="clueRow" :class="{ clueRowIos: ios }" v-for="clue in clues">
              <td>
                <a v-if="editMode" @click="edit(clue)">{{ clue.line1 }}<br/>{{ clue.line2 }}</a>
                <span v-if="!editMode">{{ clue.line1 }}<br/>{{ clue.line2 }}</span>
              </td>
              <td class="text-xs-right ">
                <v-btn v-if="editMode" icon class="mx-0" @click="deleteClue(clue)">
                  <v-icon  color="red lighten-1">delete</v-icon>
                </v-btn>
                <v-btn v-if="!editMode" icon class="mx-0" @click="send(clue)">
                  <v-icon :color="chatColor(clue.errorType)">{{chatIcon(clue.errorType)}}</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
    </v-card-text>
</template>

<script>
  export default {
    props: {
      title: String,
      clueRef: Object,
      editForm: Function,
      confirm: Function,
      send: Function,
      expandedByDefault: { type: Boolean, default: true }
    },

    data: () => ({
      ios: false,
      editMode: false,
      clues: [],
      clueDiag: false,
      clueSendDiag: false,
      clueToDelete: null,
      clueToSend: null,
      expandedLocal: true
    }),
    computed: {
      headerIcon() {
        return this.expanded ? 'expand_less' : 'expand_more'
      },
      expanded() {
        return this.expandedLocal;
      }
    },
    watch: {
    },
    created () {
      this.expandedLocal = this.expandedByDefault
      this.ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

      this.clueRef.on('child_added', (snapshot) => {
        let clue = snapshot.val()
        this.clues.push({'id':snapshot.key, ...clue})
      })
      this.clueRef.on('child_changed', (snapshot) => {
        let clue = snapshot.val()
        let aClue = this.clues.find((clue) => {
          return clue.id === snapshot.key;
        })

        aClue.line1 = clue.line1;
        aClue.line2 = clue.line2;
        aClue.errorType = clue.errorType;
      });
      this.clueRef.on('child_removed', (snapshot) => {
        this.clues = this.clues.filter((clue) => {
          return clue.id !== snapshot.key;
        })
      });
    },
    methods: {
      add() {
        this.editForm({
          title: 'New ' + this.title + ' Clue',
          clue: {},
          callback: this.saved
        })
      },
      edit(clue) {
        this.editForm({
          title: 'Edit ' + this.title + ' Clue',
          clue: Object.assign({}, clue),
          callback: this.saved
        })
      },
      deleteClue(clue) {
        this.confirm(true, () => {
          this.clueRef.child(clue.id).remove();
        })
      },
      saved(clue) {
        if (clue.id) {
          this.clueRef.child(clue.id).set({ line1: clue.line1, line2: clue.line2, errorType: clue.errorType})
        } else {
          this.clueRef.push(clue)
        }
      },
      chatIcon (error) {
        return error ? 'announcement' : 'chat_bubble'
      },
      chatColor (error) {
        return error ? 'red lighten-1' : 'blue accent-1'
      },
      headerExpCol() {
        this.expandedLocal = !this.expandedLocal
      }
    }
  }
</script>

<style scoped>
.header {
  cursor: pointer;
  user-select: none;
}
.clueRow {
  user-select: none;
}
.clueRowIos {
  background: #fff !important;
}

</style>

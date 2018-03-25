<template>
 
<v-flex>  
  <!-- morse code -->
  <v-card class="morseCard">
    <v-toolbar card>
      <v-toolbar-title>Morse Code</v-toolbar-title>
      <span class="spacer" />

      <v-btn icon title="Add a message" @click.native=""><v-icon >message</v-icon></v-btn>
      <v-btn icon title="Edit messages" @click.native="editMode = !editMode"><v-icon >edit</v-icon></v-btn>
      <v-btn icon title="Add a message" @click.native=""><v-icon >add</v-icon></v-btn>
    </v-toolbar>

    <v-card-text class="grey lighten-3">
      <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      hide-headers
      class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.line1 }} {{ props.item.line2 }}</td>
          <td class="text-xs-right ">
            <v-btn v-if="editMode" icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon  color="pink">delete</v-icon>
            </v-btn>
            <v-btn v-if="!editMode" icon class="mx-0" @click="sendClue(props.item)">
              <v-icon  color="blue accent-1">announcement</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-card-text>

  </v-card>
</v-flex>

</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      editMode: false,
      headers: [
        {
          text: 'Message',
          align: 'left',
          sortable: false
        },
        { align: 'right', text: '', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        message: ''
      },
      defaultItem: {
        message: ''
      }
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.items = [
          {
            line1: 'Cigar labels',
            line2: 'Spell something'
          }

        ]
      },
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      sendClue (item) {
        console.log('sending clue' + item.line1 + ' ' + item.line2);
      },
      deleteItem (item) {
        const index = this.items.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
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
</style>

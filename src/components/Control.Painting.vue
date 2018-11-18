<template>
<v-flex>
  <!-- painting -->
  <v-card class="paintingCard">
    <v-toolbar card>
      <v-toolbar-title>Painting
        <v-icon v-if="!isConnected" class="notConnected" title="Device disconnected">report_problem</v-icon></v-toolbar-title>
      <span class="spacer" />
    </v-toolbar>

    <v-card-text class="grey lighten-3">
 
          
          <div style="display:inline-block;vertical-align:top;padding-top:13px;padding-right:20px;">
            <v-btn 
                class="ma-0"
                small dark color="accent"
                @click.native="triggerDrop()">Drop
            </v-btn>
          </div>
          <v-text-field hide-details="true" maxlength="16" label="Threshold" value="1500" style="width:100px;display:inline-block; padding-right: 20px;"></v-text-field>
          <v-text-field hide-details="true" maxlength="16" label="Wait" value="0" style="width:50px;display:inline-block"></v-text-field>
          
 
      
    </v-card-text>
    

  </v-card>
</v-flex>
</template>

<script>
  export default {
    props: ['snack'],
    data: () => ({
      dialog: false,
      confirmDiag: false,
      isConnected: true
    }),
    computed: {
    },
    watch: {
    },
    created () {
      this.operations = this.$root.$data.operations

      this.$root.$data.fbdb.ref('painting').on('value', (snapshot) => {
        let painting = snapshot.val()
        if (painting == null) return

        this.isConnected = painting.isConnected;
        this.threshold = painting.threshold;
        this.wait = painting.wait;
      })
    },
    methods: {
      triggerDrop() {
        this.operations.add({ command: 'paint.drop' }).on("value", (snapshot) => {
        });
      },
    }
  }
</script>

<style scoped>
.paintingCard {
  margin-top: 30px;
}
.notConnected {
  margin-bottom:4px;
  margin-left:7px;
  color:red !important;
}
</style>

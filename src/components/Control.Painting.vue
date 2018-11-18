<template>
<v-flex>
  <!-- painting -->
  <v-card class="paintingCard">
    <v-toolbar card>
      <v-toolbar-title>Painting
        <v-icon v-if="!isConnected" class="notConnected" title="Device disconnected">report_problem</v-icon>
        <v-icon v-if="isEnabled" class="isEnabled" title="Light detected">wb_incandescent</v-icon>
      </v-toolbar-title>
      <span class="spacer" />
    </v-toolbar>

    <v-card-text class="grey lighten-3">
          <div class="dropBtn">
            <v-btn 
                class="ma-0"
                small dark color="accent"
                @click.native="triggerDrop()">Drop
            </v-btn>
          </div>
          <v-text-field hide-details="true" maxlength="16" label="Threshold" v-model="threshold" class="threshold"></v-text-field>
          <v-text-field hide-details="true" maxlength="16" label="Wait" v-model="wait" class="wait"></v-text-field>
    </v-card-text>

  </v-card>
</v-flex>
</template>

<script>
  export default {
    props: ['snack'],
    data: () => ({
      confirmDiag: false,
      isConnected: true,
      threshold: 0,
      wait: 0,
    }),
    created () {
      this.operations = this.$root.$data.operations

      this.$root.$data.fbdb.ref('painting').on('value', (snapshot) => {
        let painting = snapshot.val()
        if (painting == null) return

        this.isConnected = painting.isConnected;
        this.threshold = painting.threshold;
        this.wait = painting.wait;
        this.isEnabled = painting.enabled;
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
.isEnabled {
  margin-bottom:4px;
  margin-left:7px;
  color:#FFC107 !important;
}
.dropBtn {
  display:inline-block;
  vertical-align:top;
  padding-top:13px;
  padding-right:20px;
}
.threshold {
  display:inline-block;
  width:100px;
  padding-right: 20px;
}
.wait {
  width:50px;
  display:inline-block;
}
</style>

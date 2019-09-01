<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon class="cardIcon">pan_tool</v-icon>Hands
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
      <v-switch 
        primary
        v-model="forcePressed"
        :hide-details="true"
        @click.native="trigger"
      />
      <span class="spacer" />
      <span v-bind:class="{ notHolding: !isPressed }" class="lightDot" style="background:#EF5350"/>
      <span v-bind:class="{ notHolding: !isPressed }" class="lightDot" style="background:#43A047"/>
      <span v-bind:class="{ notHolding: !isPressed }" class="lightDot" style="background:#1E88E5"/>
    </v-toolbar>
  </v-card>

</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations'],
    data: () => ({
      isConnected: true,
      isPressed: false,
      forcePressed: false,
      dialog: false,
    }),
    created () {
      this.$root.$data.museumRoot.child('hands').on('value', (snapshot) => {
        let hands = snapshot.val()
        if (hands == null) return

        this.isPressed = hands.isPressed
        this.forcePressed = hands.forcePressed
      })
    },
    methods: {
      trigger() {
        this.operations.add({ command: 'hands.force', data: { forced:this.forcePressed } }).on("value", (snapshot) => {
            let cmd = this.forcePressed ? 'Enabled' : 'Disabled'
            this.snack(`${cmd} sent successfully.`)
            snapshot.ref.off()
        });
      },
    }
  }
</script>

<style scoped>
.cardIcon {
  margin-bottom:3px;
  margin-left:7px;
  padding-right: 10px;
}
.notConnected {
  color:red !important;
}
.lightDot {
  border-radius: 50%;
  height: 16px;
  width: 16px;
  margin: 2px;
}
.notHolding {
  background: #e0e0e0 !important;
}
</style>

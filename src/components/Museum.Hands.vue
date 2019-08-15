<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;">
        <v-icon class="cardIcon">pan_tool</v-icon>Hands
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
      </v-toolbar-title>
      <v-switch 
        primary
        v-model="enabled"
        :hide-details="true"
      />
      <span class="spacer" />
    </v-toolbar>
  </v-card>

</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations'],
    data: () => ({
      isConnected: true,
      enabled: false,
      dialog: false,
    }),
    created () {
      this.$root.$data.museumRoot.child('hands').on('value', (snapshot) => {
        let hands = snapshot.val()
        if (hands == null) return

        this.enabled = hands.enabled;
      })
    },
    methods: {
      trigger() {
        this.operations.add({ command: 'hands.enable' }).on("value", (snapshot) => {
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
</style>

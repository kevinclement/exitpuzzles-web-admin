<template>
<v-flex>
  <v-card flat>
    <v-toolbar card>
      <v-toolbar-title style="width:175px;color:#757575">
        <v-icon v-if="!isConnected" class="cardIcon notConnected" title="Device disconnected">report_problem</v-icon>
        <v-icon class="cardIcon">pan_tool</v-icon>Hands
      </v-toolbar-title>

      <v-switch
          v-if="isConnected"
          primary
          v-model="mock"
          :hide-details="true"
          @click.native="force"
      />
      <span class="spacer" />
      <span v-bind:class="{ notHolding: !touching }" class="lightDot" style="background:#EF5350"/>
      <span v-bind:class="{ notHolding: !touching }" class="lightDot" style="background:#43A047"/>
      <span v-bind:class="{ notHolding: !touching }" class="lightDot" style="background:#1E88E5"/>

      <v-btn flat small color="blue-grey lighten-3" @click.native="$emit('show-details')">Advanced</v-btn>
      <v-btn v-if="isConnected" flat small color="red lighten-3" @click.native="$emit('reboot-device', 'hands')">Reboot</v-btn>

    </v-toolbar>
  </v-card>

</v-flex>
</template>

<script>
  export default {
    props: ['snack', 'operations'],
    data: () => ({
      isConnected: true,
      touching: false,
      mock: false,
    }),
    created () {
      this.$root.$data.museumRoot.child('devices/hands').on('value', (snapshot) => {
        let hands = snapshot.val()
        if (hands == null) return

        this.touching = hands.touching
        this.mock = hands.mock
        this.isConnected = hands.info.isConnected
      })
    },
    methods: {
      force() {
        this.operations.add({ command: 'hands.toggle' }).on("value", (snapshot) => {});
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
  padding-right:0px;
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

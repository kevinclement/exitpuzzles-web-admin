<template>
  <v-container fluid>
    <v-navigation-drawer fixed app clipped right dense
      v-model="showDetails"
      class="rightDrawer"
      :hide-overlay="true"
      :stateless="true"
    >
      <!-- advanced panels -->
      <museum-mummy-advanced 
        v-on:close-details="advanced.mummy = false"
        v-if="advanced.mummy == true"
        :operations="operations"/>
    </v-navigation-drawer>

    <!-- controls -->
    <museum-mummy 
      v-on:show-details="advanced.mummy = true" 
      v-on:reboot-device="showRebootDialog" 
      :snack="showSnack" 
      :operations="operations"/>

    <!-- snackbar notifications -->
    <v-snackbar :timeout="snackTimeout" :color="snackColor" v-model="snackbar">
      {{ snackText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>

    <!-- shared reboot dialog since all devices have similar logic -->
    <v-dialog v-model="dialogRebootShow" max-width="410">
    <v-card>
      <v-card-title class="headline">Really reboot the {{dialogRebootDevice}}?</v-card-title>
      <v-card-text>This will reboot the device and all current state lost.  Are you <i>sure</i> you want to do that?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="dialogRebootShow = false;">No</v-btn>
        <v-btn color="primary" flat="flat" @click.native="triggerReboot">Yes</v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import Mummy from '@/components/Museum.Mummy'
import MummyAdvanced from '@/components/Museum.Mummy.Advanced'

export default {
  data () {
    return {
      snackbar: false,
      snackColor: 'success',
      snackTimeout: 4000,
      snackText: '',
      advanced: {
        mummy: false,
      },
      showDetails: false,
      dialogRebootShow: false,
      dialogRebootDevice: "",
      operations: {},
    }
  },

  watch: {
    advanced: {
      handler(val){
        // this took me too long to figure out, flashback to mvvm reactive crap :'(
        this.showDetails = this.advanced[Object.keys(val)[0]];
      },
      deep: true
    }
  },

  created () {
    this.operations =  this.$root.$data.museumOps
  },

  methods: {
    showSnack(msg) {
      this.snackText = msg 
      this.snackbar = true
    },
    triggerReboot() {
      this.operations.add({ command: 'triggerDeviceReboot', data: { device: this.dialogRebootDevice } }).on("value", (snapshot) => {
        if (snapshot.val().received) {
          this.snack('Device rebooted successfully.')
        }
      });
      this.dialogRebootShow = false
      this.dialogRebootDevice = ""
    },
    showRebootDialog(device) {
      this.dialogRebootDevice = device
      this.dialogRebootShow = true
    }
  },

  components: {
    'museum-mummy': Mummy,
    'museum-mummy-advanced': MummyAdvanced,
  }
}
</script>

<style scoped>
  .rightDrawer {
    z-index:1;
  }
  
</style>

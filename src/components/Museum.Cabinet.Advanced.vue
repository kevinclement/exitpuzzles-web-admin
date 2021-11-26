<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'cabinet')">Reboot</v-btn>
  </div>
  <div class="actionRow" style="padding-top:50px;">
    <v-btn @click.native="ping"><v-icon style="padding-right:5px;">offline_bolt</v-icon>Check Status</v-btn>
  </div>
  <div class="actionRow" style="padding-left:15px;padding-top:5px;" v-if="status != ''" :class="statusToClass()">
        <div style="font-family: Monaco, monospace;">{{status}} @ {{statusCheckTime}}!</div>
        <div style="font-family: Monaco, monospace;">{{statusError}}</div>
  </div>


</div>
</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      status: "",
      statusCheckTime: "",
      statusError: "",
    }),
    computed: {
    },
    created () {
      this.$root.$data.museumRoot.child('devices/cabinet').on('value', (snapshot) => {
        let cabinet = snapshot.val()
        if (cabinet == null) return
      })
    },
    methods: {
      ping() {
        // clear data object before issuing command
        this.status = "";
        this.statusCheckTime = "";
        this.statusError = "";

        this.operations.add({ command: 'cabinet.ping' }).on("value", (snapshot) => {
          let ping = snapshot.val()
          if (ping == null) return;
          
           if (ping.completed) {
            this.status = "OK";
            let compTime = new Date(ping.completed);
            this.statusCheckTime = compTime.toLocaleString();
          }

          if (ping.error) {
            this.status = "ERROR";
            this.statusError = ping.error;
          }
        });
      },

      statusToClass() {
        if (this.status == "ERROR") {
          return "statusError";
        } 
        else {
          return "statusOkay";
        }
      },
    }
  }
</script>

<style scoped>
  .statusOkay {
    color: green;
  }
  .statusError {
    color: red;
  }
</style>


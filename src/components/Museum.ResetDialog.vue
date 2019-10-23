
<template>

  <v-dialog v-model="show" max-width="350px">
    <v-card>
      <v-card-title>
        <h4>Resetting Room...</h4>
      </v-card-title>
      <v-divider></v-divider>

      <v-list class="resetRoom" dense>
        <v-list-tile>
          <v-list-tile-content>Clock</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-icon style="color:#4CAF50">done</v-icon>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Quiz</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-icon style="color:#BDBDBD">check</v-icon>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Birdcage</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-icon style="color:#BDBDBD">check</v-icon>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Zoltar</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-icon>check</v-icon>
          </v-list-tile-content>
        </v-list-tile>
        
        <v-list-tile>
          <v-list-tile-content>Cabinet</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-icon style="">check</v-icon>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>

        <v-list-tile style="padding-top:5px;">
          <v-list-tile-content class="align-end">
            Time Taken: 00:33
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-dialog>

</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      show: true
    }),
    computed: {
    },
    created () {
    },
    methods: {
    }
  }
</script>

<style scoped>
  .resetRoom i {
    color:#BDBDBD !important;
  }
</style>


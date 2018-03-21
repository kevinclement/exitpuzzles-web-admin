<template>
 <v-container fluid fill-height>
  <v-layout >
    <v-flex>
      <v-card>
        <v-toolbar card>
          <v-toolbar-title>TNT Status</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="grey lighten-3">
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <span>Time</span>
                    <v-switch primary label="Dark"></v-switch>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-card>
                      <v-card-title>
                        <h4>State</h4>
                      </v-card-title>
                      <v-divider></v-divider>

                      <v-list dense>
                        <v-list-tile>
                          <v-list-tile-content>Toggle 1:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#4CAF50">check_circle</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>Toggle 2:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#BDBDBD">help</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>Wire:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#F44336">error</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider/>
                        <v-list-tile>
                          <v-list-tile-content>Key Solved:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#4CAF50">done</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>All Solved:</v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <v-icon style="color:#4CAF50">done_all</v-icon>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>

                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card-text>
      </v-card>

      <div>
        <v-btn icon><v-icon >build</v-icon>1</v-btn>
        <v-btn icon><v-icon >build</v-icon>2</v-btn>
        <v-btn icon><v-icon >timeline</v-icon></v-btn>
        <v-btn icon><v-icon >lock</v-icon></v-btn>
        <v-btn icon><v-icon >cake</v-icon></v-btn>
      </div>
    </v-flex>
  </v-layout>
</v-container>


</template>

<style scoped>
</style>

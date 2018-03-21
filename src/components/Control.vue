<template>
 <v-container fluid fill-height>
  <v-layout >
    <v-flex>

      <v-card>
        <v-toolbar card>
          <v-toolbar-title>TNT</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn flat>Link One</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <span>Scheme</span>
                    <v-switch primary label="Dark"></v-switch>
                  </v-flex>
                  <v-flex xs12 md6>
                    <span>Drawer</span>
                    <v-radio-group column>
                      <v-radio
                        primary
                      ></v-radio>
                    </v-radio-group>
                    <v-switch label="Clipped" primary></v-switch>
                    <v-switch label="Floating"  primary></v-switch>
                    <v-switch label="Mini"  primary></v-switch>
                  </v-flex>
                  <v-flex xs12 md6>
                    <span>Footer</span>
                    <v-switch label="Inset"  primary></v-switch>
                  </v-flex>
                </v-layout>
              </v-card-text>

        <div data-app="data-app" class="application application--example pa-3 theme--light grey lighten-3">
            foo
        </div>
      </v-card>

    </v-flex>
  </v-layout>
</v-container>

</template>

<style scoped>
</style>

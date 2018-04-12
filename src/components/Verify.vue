<template>
<v-container fluid fill-height>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
            <v-toolbar dark color="grey lighten-3">
                <v-toolbar-title style="color:black">Create password</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-text-field prepend-icon="lock" v-model="password" name="password" label="Password" id="password" type="password"></v-text-field>
                    <v-text-field prepend-icon=" " v-model="confirm" name="confirm" label="Confirm Password" id="confirm" type="password"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <span v-if="errorMessage !== ''" style="padding-left:16px;color:#E53935">* {{errorMessage}}</span>
                <v-spacer></v-spacer>
                <v-btn color="accent" @click="verify" :disabled="this.password === ''">Create</v-btn>
            </v-card-actions>
        </v-card>
        </v-flex>
    </v-layout>
    </v-container>
</template>
</template>

<script>
export default {
  props: ['token'],
  data () {
    return {
        password: '',
        errorMessage: '',
        confirm: ''
    }
  },
  methods: {
      verify() {
          if (this.password !== this.confirm) {
              this.errorMessage = 'passwords don\'t match'
          } else {
              this.errorMessage = ''
          }

          console.log('doing verify on ' + this.token + ' setting password to ' + this.password)
        //   this.$root.$data.auth.acceptInvite(this.token, this.password, true).then(user =>) {
        //       console.log('user ' + user.email + ' verified redirecting to root')
        //       this.$router.push('/')
        //   }, this.errorMessage = error.message.replace(/.*:/, '') )
      }
  }
}
</script>

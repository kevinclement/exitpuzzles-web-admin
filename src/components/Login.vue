<template>
<v-container fluid fill-height>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
            <v-card-text>
                <v-form>
                    <v-text-field prepend-icon="person" v-model="user" name="login" label="Login" type="text"></v-text-field>
                    <v-text-field prepend-icon="lock" v-model="password" name="password" label="Password" id="password" type="password"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <span v-if="errorMessage !== ''" style="padding-left:16px;color:#E53935">* {{errorMessage}}</span>
                <v-spacer></v-spacer>
                <v-btn color="accent" @click="login">Sign in</v-btn>
            </v-card-actions>
        </v-card>
        </v-flex>
    </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
        user: '',
        password: '',
        errorMessage: ''
    }
  },
  methods: {
    login() {
        this.$root.$data.auth.login(this.user, this.password, true).then(user => {
            console.log("Logged in as %s", user.email)
            this.$root.$data.loggedInCallback(user)
            this.$router.push('/')
        }, error => {
            this.errorMessage = error.message.replace(/.*:/, '')
            console.log("Failed to log in: %o", error)
        })
      }
  }
}
</script>

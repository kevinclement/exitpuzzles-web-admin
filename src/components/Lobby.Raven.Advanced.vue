<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="advForm">

    <!-- <v-text-field type="number" v-model="form.time_out" label="Timeout" :disabled="loading"/>
    <v-text-field type="number" v-model="form.total_questions" label="Total" :disabled="loading" /> -->

  </div>
  <!-- <div style="margin:5px 10px 0px 10px">
    <v-btn small @click.native="save" :disabled="saveDisabled">save</v-btn>
    <v-btn small @click.native="reset"> reset</v-btn>
  </div> -->

</div>
</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      loading: true,

      timeout:0,
      total:0,

      form:  {
        time_out: 0,
        total_questions: 0
      },
    }),
    computed: {
      saveDisabled: function() {
        // this made me question my profession
        return !(!this.loading && this.dirty) 
      },
      dirty: function() {
        return this.form.time_out != this.timeout || this.form.total_questions != this.total
      },
    },
    created () {
      this.$root.$data.lobbyRoot.child('devices/raven').once('value', (snapshot) => {
        let raven = snapshot.val()
        if (raven == null) return

        // this.timeout = quiz.timeout
        // this.total = quiz.total

        // this.reset();

        this.loading = false;
      })
    },
    methods: {
      save() {
        // this.timeout = this.form.time_out
        // this.total = this.form.total_questions

        // // save the new config and force a quiz restart
        // this.$root.$data.museumRoot.child('devices/quiz').update({
        //   timeout: this.timeout,
        //   total: this.total
        // })

        this.$root.$emit('close-details')
      },
      reset() {
        this.form.time_out = this.timeout
        this.form.total_questions = this.total
      },
    }
  }
</script>

<style scoped>
  .advForm {
    padding-left:15px;
    padding-right: 15px;
  }
</style>
<style>
  input[type=number]::-webkit-inner-spin-button {
      display:none;
  }
</style>

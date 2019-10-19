<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="advForm">

    <v-text-field type="number" v-model="form.hours" label="Hours" :disabled="loading"/>
    <v-text-field type="number" v-model="form.minutes" label="Minutes" :disabled="loading" />

  </div>
  <div style="margin:5px 10px 0px 10px">
    <v-btn small @click.native="save" :disabled="saveDisabled">save</v-btn>
    <v-btn small @click.native="reset"> reset</v-btn>
  </div>

</div>
</template>

<script>
  export default {
    props: ['operations'],

    data: () => ({
      loading: true,

      hours:0,
      minutes:0,

      form:  {
        hours: 0,
        minutes: 0
      },
    }),
    computed: {
      saveDisabled: function() {
        // this made me question my profession
        return !(!this.loading && this.dirty) 
      },
      dirty: function() {
        return this.form.hours != this.hours || this.form.minutes != this.minutes
      },
    },
    created () {
      this.$root.$data.museumRoot.child('devices/dashboard').once('value', (snapshot) => {
        let dash = snapshot.val()
        if (dash == null) return

        this.hours = dash.hours
        this.minutes = dash.minutes

        this.reset();
        this.loading = false;
      })
    },
    methods: {
      save() {
        this.hours = this.form.hours
        this.minutes = this.form.minutes

        // save the new config and force a quiz restart
        this.$root.$data.museumRoot.child('devices/dashboard').update({
          hours: this.hours,
          minutes: this.minutes
        })
      },
      reset() {
        this.form.hours = this.hours
        this.form.minutes = this.minutes
      },
    }
  }
</script>

<style scoped>
  .advForm {
    padding-left:15px;
    padding-right: 15px;
  }
  .actionRow {
    padding-left:10px;
    padding-right: 10px;
    padding-top:15px;
    padding-bottom:10px;
  }
  .actionRow button {
    margin-top:0px;
    margin-bottom:0px;
  }
</style>


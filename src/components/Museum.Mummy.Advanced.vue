<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="advForm">

    <v-text-field type="number" v-model="form.db" label="Debounce" :disabled="loading"/>
    <v-text-field type="number" v-model="form.lnfm" label="Lightning: max flashes" :disabled="loading" />
    <v-text-field type="number" v-model="form.ltbe" label="Lightning: time between events" :disabled="loading"/>
    <v-text-field type="number" v-model="form.ltbf" label="Lightning: time between flashes" :disabled="loading"/>
    <v-text-field type="number" v-model="form.mos" label="Primary Sensitivity" :disabled="loading"/>
    <v-text-field type="number" v-model="form.mts" label="Secondary Sensitivity" :disabled="loading"/>

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

    // original number before I stored them in DB, DB is source of truth
    data: () => ({
      loading: true,

      debounce: 500,
      lightning_number_flashes_max: 7,
      lightning_time_between_events: 2579,
      lightning_time_between_flashes: 22,
      measure_one_sensitivity: 1200,
      measure_two_sensitivity: 1000,

      form:  {
        db: 0,
        lnfm: 0,
        ltbe: 0,
        ltbf: 0,
        mos: 0,
        mts: 0,
      },
    }),
    computed: {
      saveDisabled: function() {
        // this made me question my profession
        return !(!this.loading && this.dirty) 
      },
      dirty: function() {
        return this.form.db != this.debounce ||
          this.form.lnfm != this.lightning_number_flashes_max ||
          this.form.ltbe != this.lightning_time_between_events ||
          this.form.ltbf != this.lightning_time_between_flashes ||
          this.form.mos != this.measure_one_sensitivity ||
          this.form.mts != this.measure_two_sensitivity
      },
    },
    created () {
      this.$root.$data.museumRoot.child('mummy').on('value', (snapshot) => {
        let mummy = snapshot.val()
        if (mummy == null) return

        this.debounce = mummy.debounce
        this.lightning_number_flashes_max = mummy.lightning_number_flashes_max
        this.lightning_time_between_events = mummy.lightning_time_between_events
        this.lightning_time_between_flashes = mummy.lightning_time_between_flashes
        this.measure_one_sensitivity = mummy.measure_one_sensitivity
        this.measure_two_sensitivity = mummy.measure_two_sensitivity

        this.reset();

        this.loading = false;
      })
    },
    methods: {
      save() {
        this.operations.add({ command: 'mummy.set', data: this.form }).on("value", (snapshot) => {
          if (snapshot.val().received) {
            this.snack('Set advanced settings successfully.')
          }
        });
      },
      reset() {
        this.form.db = this.debounce;
        this.form.lnfm = this.lightning_number_flashes_max
        this.form.ltbe = this.lightning_time_between_events
        this.form.ltbf = this.lightning_time_between_flashes
        this.form.mos = this.measure_one_sensitivity
        this.form.mts = this.measure_two_sensitivity
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

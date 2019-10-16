<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="advForm">

    <v-text-field type="number" v-model="form.timeout" label="Timeout" :disabled="loading"/>
    <v-text-field type="number" v-model="form.total" label="Total" :disabled="loading" />

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

      timeout:0,
      total:0,

      form:  {
        timeout: 0,
        total: 0
      },
    }),
    computed: {
      saveDisabled: function() {
        // this made me question my profession
        return !(!this.loading && this.dirty) 
      },
      dirty: function() {
        return this.form.timeout != this.timeout || this.form.total != this.total
      },
    },
    created () {
      this.$root.$data.museumRoot.child('devices/quiz').on('value', (snapshot) => {
        let quiz = snapshot.val()
        if (quiz == null) return

        this.timeout = quiz.timeout
        this.total = quiz.total

        this.reset();

        this.loading = false;
      })
    },
    methods: {
      save() {
        let obj = {
          timeout: this.form.timeout,
          total: this.form.total
        }

        // only force a screen change if we changed the total
        if (this.total != this.form.total) {
          obj.force = 1
        }

        this.timeout = this.form.timeout
        this.total = this.form.total

        // save the new config and force a quiz restart
        this.$root.$data.museumRoot.child('devices/quiz').update(obj)

        this.$root.$emit('close-details')
      },
      reset() {
        this.form.timeout = this.timeout
        this.form.total = this.total
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
<style>
  input[type=number]::-webkit-inner-spin-button {
      display:none;
  }
</style>

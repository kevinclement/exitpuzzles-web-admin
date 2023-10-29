<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="advForm">

    <v-text-field type="number" v-model="form.wait_time" label="Wait Time (min)" :disabled="loading"/>

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

      waitTime:0,

      form:  {
        wait_time: 0
      },
    }),
    computed: {
      saveDisabled: function() {
        // this made me question my profession
        return !(!this.loading && this.dirty) 
      },
      dirty: function() {
        return this.form.wait_time != this.waitTime
      },
    },
    created () {
      this.$root.$data.lobbyRoot.child('devices/raven').once('value', (snapshot) => {
        let raven = snapshot.val()
        if (raven == null) return

        this.waitTime = raven.animationWaitTimeMin

        this.reset();

        this.loading = false;
      })
    },
    methods: {
      save() {
        this.waitTime = this.form.wait_time

        // save the new config 
        this.$root.$data.lobbyRoot.child('devices/raven').update({
          animationWaitTimeMin: parseInt(this.waitTime)
        })

        this.$root.$emit('close-details')
      },
      reset() {
        this.form.wait_time = this.waitTime
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

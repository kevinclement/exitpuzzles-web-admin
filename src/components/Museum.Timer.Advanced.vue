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

    <div class="clueWrap" v-for="clue in Object.entries(clues)" :key="clue[0]">
      <img :class="{ clueSel: clue[1].sel }" @click="imgSel(clue[0])" class="clueImg" :src="imgSrc(clue[1].img)" :title="clue[0]"/>
    </div>
  </div>
  <div style="margin:25px 10px 0px 10px">
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

      clues: {
        home: { sel: false, img: "home.png" },
        clock: { sel: false, img: "clock.png" },
        map: { sel: false, img: "map.png" },
        dodo: { sel: false, img: "dodo.png" },
        hands: { sel: false, img: "hands.png" },
        chair: { sel: false, img: "laser-chair.png" }
      },  

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
        this.resetSel()
      },
      imgSrc(img) {
        return '/static/museum/clues/' + img
      },
      imgSel(key) {
        // turn all others off
        this.resetSel()

        // turn selected on on/off
        this.clues[key].sel = !this.clues[key].sel
      },
      resetSel() {
        for (const [k, clue] of Object.entries(this.clues)) {
          this.clues[k].sel = false
        }
      }
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

  .clueWrap {
    display: inline-block;
    width: 100px;
    height: 80px;
    padding-right:3px;
  }
  .clueImg {
    width: 100px;
    height: 80px;
    border:3px solid rgba(0, 0, 0, 0.0);
  }
  .clueSel {
    border:3px solid rgba(0, 0, 0, 0.6);
    border-radius: 4px
  }
  
</style>


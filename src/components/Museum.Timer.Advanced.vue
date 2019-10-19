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
        home: { sel: false, img: "home.png", index:-1 },
        clock: { sel: false, img: "clock.png", index:0 },
        dodo: { sel: false, img: "dodo.png", index:1 },
        hands: { sel: false, img: "hands.png", index:3 },
        map: { sel: false, img: "map.png", index:5 },
        chair: { sel: false, img: "laser-chair.png", index:11 },
        laser: { sel: false, img: "laser.align.png", index:4 }

      },
      clue: -2,
      route: "",
      adhoc: "",

      form:  {
        hours: 0,
        minutes: 0,
        clue: -2
      },
    }),
    computed: {
      saveDisabled: function() {
        // this made me question my profession
        return !(!this.loading && this.dirty) 
      },
      dirty: function() {
        return this.form.hours != this.hours || this.form.minutes != this.minutes || this.form.clue != this.clue
      },
    },
    created () {
      this.$root.$data.museumRoot.child('devices/dashboard').once('value', (snapshot) => {
        let dash = snapshot.val()
        if (dash == null) return

        this.hours = dash.hours
        this.minutes = dash.minutes
        this.clue = dash.clue
        this.route = dash.route

        this.reset();
        this.loading = false;
      })
    },
    methods: {
      save() {
        this.clue = this.form.clue
        this.route = this.form.clue == -1 ? "home" : "clue"
        this.adhoc = "" // TODO

        let obj = {
          clue: this.clue,
          route: this.route,
          adhoc: this.adhoc
        }

        // since time is a snapshot, only update it if we've changed it
        if (this.hours != this.form.hours) {
          this.hours = this.form.hours
          obj.hours = this.hours
        } 
        
        if (this.minutes != this.form.minutes) {
          this.minutes = this.form.minutes
          obj.minutes = this.minutes
        }

        // save the new config and force a quiz restart
        this.$root.$data.museumRoot.child('devices/dashboard').update(obj)
      },
      reset() {
        this.form.hours = this.hours
        this.form.minutes = this.minutes
        this.form.clue = this.clue
        this.resetSel(this.clue)
      },
      imgSrc(img) {
        return '/static/museum/clues/' + img
      },
      imgSel(key) {
        // turn all others off
        this.resetSel()

        // turn selected on on/off
        this.clues[key].sel = !this.clues[key].sel
        this.form.clue = this.clues[key].index
      },
      resetSel(c) {
        for (const [k, clue] of Object.entries(this.clues)) {
          this.clues[k].sel = c && clue.index == c          
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


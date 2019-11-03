<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="advForm">
    <v-text-field style="width:100px;display:inline-block;margin-right:20px;" type="number" v-model="form.hours" label="Hours" :disabled="loading"/>
    <v-text-field style="width:100px;display:inline-block;margin-left: 20px;" type="number" v-model="form.minutes" label="Minutes" :disabled="loading" />
    <div>
      <v-text-field type="string" multi-line class="adhocMulti" rows="2" v-model="form.adhoc" label="Adhoc" :disabled="loading" />
      <v-btn class="clueSnd" title="Play clue sound" @click.native="playNotice">
        <v-icon color="grey lighten-1">volume_up</v-icon>
      </v-btn>
    </div>
    

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
  const CLUE_TYPE = { 
    HOME: -1,
    AD_HOC: -2
  }

  export default {
    props: ['operations'],

    data: () => ({
      loading: true,

      hours:0,
      minutes:0,

      clues: {
        home:      { sel: false, index: CLUE_TYPE.HOME, img: "home.png" },
        empty:     { sel: false, index: CLUE_TYPE.AD_HOC, img: "empty.png" },

        totem:     { sel: false, index: 10, img: "totem.png" },
        clock:     { sel: false, index:  0, img: "clock2.png" },
        dodo:      { sel: false, index:  1, img: "dodo.png" },
        hands:     { sel: false, index:  3, img: "hands.png" },
        color:     { sel: false, index:  2, img: "colors.png" },
        map:       { sel: false, index:  5, img: "map.png" },
        riddle:    { sel: false, index:  6, img: "riddle.png" },
        safe:      { sel: false, index:  7, img: "safe.png" },
        chair:     { sel: false, index: 11, img: "laser.chair.png" },
        laser:     { sel: false, index:  4, img: "laser.align.png" },
        laser:     { sel: false, index: 12, img: "egyptian.column.jpg" },
        readme:    { sel: false, index:  8, img: "readme.png" },
        translate: { sel: false, index:  9, img: "translate.png" }
      },
      clue: CLUE_TYPE.AD_HOC,
      route: "",
      adhoc: "",

      form:  {
        hours: 0,
        minutes: 0,
        clue: CLUE_TYPE.AD_HOC,
        adhoc: ""
      },
    }),
    computed: {
      saveDisabled: function() {
        // this made me question my profession
        return !(!this.loading && this.dirty) 
      },
      dirty: function() {
        let res = this.form.hours != this.hours ||
          this.form.minutes != this.minutes ||
          this.form.clue != this.clue || 
          this.form.adhoc != this.adhoc

        return res
          
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
        this.adhoc = dash.adhoc

        this.reset();
        this.loading = false;
      })
    },
    methods: {
      save() {
        this.clue = this.form.clue
        this.route = this.form.clue == CLUE_TYPE.HOME ? "home" : "clue"
        this.adhoc = this.form.adhoc

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

        // increment analytics
        if (this.form.clue == CLUE_TYPE.AD_HOC) {
          this.$root.$data.museumRuns.addClue(true)
        } else if (this.form.clue >= 0) {
          this.$root.$data.museumRuns.addClue(false)
        }

      },
      reset() {
        this.form.hours = this.hours
        this.form.minutes = this.minutes
        this.form.clue = this.clue
        this.form.adhoc = this.adhoc
        this.resetSel(this.clue)
      },
      playNotice() {
        this.$root.$data.museumRoot.child('devices/dashboard').update({
          notice: true
        })
      },
      imgSrc(img) {
        return '/static/museum/clues/' + img
      },
      imgSel(key) {
        // turn all others off
        this.resetSel()

        // if empty isn't selected, clear adhoc
        if (key != 'empty') {
          this.form.adhoc = ""
        }

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
  .clueSnd {
    display: inline-block;
    margin-top: 31px;
    margin-bottom: 0px;
    margin-left: 5px;
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
  .adhocMulti {
    width:200px;
    display: inline-block;
  }
</style>
<style>
  input[type=number]::-webkit-inner-spin-button {
      display:none;
  }
  textarea {
      resize: none !important;
  }
</style>


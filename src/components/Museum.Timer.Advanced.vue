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
    <v-text-field type="string" v-model="form.adhoc" label="Adhoc" :disabled="loading" />

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
        home:      { sel: false, index: -1, img: "home.png" },
        empty:     { sel: false, index: -2, img: "empty.png" },
        totem:     { sel: false, index: 10, img: "totem.png" },
        clock:     { sel: false, index:  0, img: "clock2.png" },
        dodo:      { sel: false, index:  1, img: "dodo.png" },
        color:     { sel: false, index:  3, img: "hands.png" },
        hands:     { sel: false, index:  2, img: "colors.png" },
        map:       { sel: false, index:  5, img: "map.png" },
        riddle:    { sel: false, index:  6, img: "riddle.png" },
        safe:      { sel: false, index:  7, img: "safe.png" },
        chair:     { sel: false, index: 11, img: "laser-chair.png" },
        laser:     { sel: false, index:  4, img: "laser.align.png" },
        readme:    { sel: false, index:  8, img: "readme.png" },
        translate: { sel: false, index:  9, img: "translate.png" }
  
      },
      clue: -2,
      route: "",
      adhoc: "",

      form:  {
        hours: 0,
        minutes: 0,
        clue: -2,
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
          this.form.clue != this.clue 

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
        this.route = this.form.clue == -1 ? "home" : "clue"
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
      },
      reset() {
        this.form.hours = this.hours
        this.form.minutes = this.minutes
        this.form.clue = this.clue
        this.form.adhoc = this.adhoc
        this.resetSel(this.clue)
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


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
      <v-text-field type="string" @click.native="adhocFocus" v-on:keyup="adhocPress" multi-line class="adhocMulti" rows="2" v-model="form.adhoc" label="Adhoc" :disabled="loading" />
      <v-btn class="clueSnd" title="Play clue sound" @click.native="playNotice">
        <v-icon color="grey lighten-1">volume_up</v-icon>
      </v-btn>
    </div>

    <div class="clueWrap" v-for="clue in clues" :key="clue.name">
      <img :class="{ clueSel: form.selectedClue == clue }" @click="imgSel(clue)" class="clueImg" :src="clueSrc(clue)" :title="clue.name" />
    </div>
    
  </div>
  <div style="margin:25px 10px 0px 10px">
    <v-btn small @click.native="save" :disabled="saveDisabled">save</v-btn>
    <v-btn small @click.native="reset">reset</v-btn>
    <v-btn small @click.native="showUpload" class="upload">
      <v-icon >cloud_upload</v-icon>
    </v-btn>
  </div>

  <v-dialog v-model="dialogUpload" v-if="dialogUpload" max-width="373">
      <v-card>
        <v-card-title class="headline">Upload a new clue</v-card-title>
        <museum-timer-uploadClue v-if="dialogUpload" />
      </v-card>
  </v-dialog>

</div>
</template>

<script>
  import UploadClue from '@/components/Museum.Timer.UploadClue'

  const CLUE_TYPE = {
    AD_HOC: "empty"
  }

  export default {
    props: ['operations'],

    data: () => ({
      loading: true,
      dialogUpload: false,

      hours:0,
      minutes:0,

      adhoc: "",
      clues: [],
      clue: "",
      selectedClue: undefined,

      form:  {
        hours: 0,
        minutes: 0,
        selectedClue: undefined,
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
          this.form.selectedClue != this.selectedClue || 
          this.form.adhoc != this.adhoc

        return res
      },
    },
    created () {

      this.$root.$on('close-upload', () => { this.dialogUpload = false })

      this.$root.$data.museumRoot.child('devices/dashboard').on('value', (snapshot) => {
        let dash = snapshot.val()
        if (dash == null) return

        this.hours = dash.hours
        this.minutes = dash.minutes
        this.clue = dash.clue
        this.adhoc = dash.adhoc

        // save current state of adhoc to restore it in case it changed
        let currentAdHocForm = this.form.adhoc

        if (dash.clues) {
          this.clues = dash.clues
          this.clues.forEach(clue => {
            if (clue.name == this.clue) {
              this.selectedClue = clue
            }
          })
        }

        this.reset();

        // after reset, restore adhoc so we don't lose state if typing
        if (this.form.adhoc != "") {
          this.form.adhoc = currentAdHocForm
        }

        this.loading = false;
      })
    },
    methods: {
      clueSrc(clue) {
        return `https://firebasestorage.googleapis.com/v0/b/exitpuzzles-admin.appspot.com/o/museum%2Fclues%2F${clue.name}.small.png?alt=media`
      },
      save() {
        let origClue = this.clue
        let origTLAS = (this.hours * 60 * 60) + (this.minutes * 60)
        let newTLAS = (this.form.hours * 60 * 60) + (this.form.minutes * 60)

        if (this.adhoc != this.form.adhoc && this.form.adhoc != "") {
          this.form.clue = this.clue = CLUE_TYPE.AD_HOC
          this.resetSel()
        } else {
          this.clue = this.form.selectedClue.name
        }
        this.adhoc = this.form.adhoc

        let obj = {
          clue: this.clue,
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
        if (this.form.clue != origClue && this.form.clue == CLUE_TYPE.AD_HOC) {
          this.$root.$data.museumRuns.addClue(true)
        } else if (this.form.clue != origClue && this.form.clue != "") {
          this.$root.$data.museumRuns.addClue(false)
        }
        if (newTLAS > origTLAS) {
          this.$root.$data.museumRuns.addTime(newTLAS - origTLAS)
        }

      },
      reset() {
        this.form.hours = this.hours
        this.form.minutes = this.minutes
        this.form.clue = this.clue
        
        // turning this off for now to not clear every second
        // this.form.adhoc = this.adhoc

        this.resetSel(this.selectedClue)
      },
      showUpload(e) {
        this.dialogUpload = true
        e.preventDefault()
      },
      adhocFocus() {
        this.form.adhoc = ""
      },
      adhocPress(e) {
        if (!this.saveDisabled && e.keyCode == 13 && (e.ctrlKey || e.metaKey)) {
          this.save()
        }
      },
      playNotice() {
        this.$root.$data.museumRoot.child('devices/dashboard').update({
          notice: true
        })
      },
      imgSrc(img) {
        return '/static/museum/clues/' + img
      },
      imgSel(clue) {
        // turn all others off
        this.resetSel()

        // clear adhoc
        this.form.adhoc = ""

        // turn selected on on/off
        this.form.selectedClue = clue
      },
      resetSel(c) {
        this.form.selectedClue = c
      }
    },
    
    components: {
      'museum-timer-uploadClue': UploadClue
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
    vertical-align: top;
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
    -webkit-user-drag: none;
  }
  .clueSel {
    border:3px solid rgba(0, 0, 0, 0.6);
    border-radius: 4px
  }
  .adhocMulti {
    width:200px;
    display: inline-block;
  }
  .upload {
    min-width: 50px;
    margin-left: 8px;
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


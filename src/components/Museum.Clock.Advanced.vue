<template>
<div>

  <v-toolbar card color="white">
    <v-toolbar-title>Advanced</v-toolbar-title>
    <span class="spacer" />
    <a v-on:click.stop="$root.$emit('close-details')"><v-icon>close</v-icon></a>
  </v-toolbar>

  <div class="actionRow" style="padding-bottom:30px;">
    <v-btn small color="red lighten-3" @click.native="$root.$emit('reboot-device', 'clock')">Reboot</v-btn>
  </div>

  <div class="actionRow" style="padding-left:15px;font-size:18px;font-weight:400;">
    <v-btn @click.native="tmpModHour(true)" style="margin-bottom:10px;min-width:10px;width:40px;">h+</v-btn>
    <v-btn @click.native="tmpModHour(false)" style="margin-bottom:10px;min-width:10px;width:40px;">h-</v-btn>
    <v-btn @click.native="tmpModMin(true)" style="margin-bottom:10px;min-width:10px;width:40px;">m+</v-btn>
    <v-btn @click.native="tmpModMin(false)" style="margin-bottom:10px;min-width:10px;width:40px;">m-</v-btn>
    <canvas id="clockCanvas" width="200" height="200" style=""></canvas>
  </div>

  <div class="actionRow" style="padding-left:15px;font-size:18px;font-weight:400;">
    HOUR
  </div>
  <div class="actionRow">
    <v-btn @click.native="hourInc"><v-icon>add</v-icon></v-btn>
    <v-btn @click.native="hourDec"><v-icon>remove</v-icon></v-btn>
  </div>

  <div class="actionRow" style="padding-top:20px;padding-left:15px;font-size:18px;font-weight:400;">
    MINUTE
  </div>
  <div class="actionRow">
    <v-btn @click.native="minuteInc"><v-icon>add</v-icon></v-btn>
    <v-btn @click.native="minuteDec"><v-icon>remove</v-icon></v-btn>
  </div>
</div>
</template>

<script>
  const NUM_STEPS = 720
  export default {
    props: ['operations'],

    data: () => ({
      ctx: null,
      radius: 0,
      tmpHour: 1,
      tmpMin: 30,

      hourPos: 0,
      minPos: 0
    }),
    computed: {
    },
    watch: {
      hourPos: function(newTime) {
        this.tmp();
      },
      minPos: function(newTime) {
        this.tmp();
      },
    },
    created () {
      this.$root.$data.museumRoot.child('devices/clock').on('value', (snapshot) => {
        let clock = snapshot.val()
        if (clock == null) return

        this.hourPos = clock.hourMotorPos
        this.minPos = clock.minMotorPos
      })
    },
    mounted() {
      let canvas = document.getElementById('clockCanvas');    
      this.ctx = canvas.getContext('2d');
      this.radius = canvas.height / 2;
      this.ctx.translate(this.radius, this.radius);
      this.radius = this.radius * 0.90;

      this.tmp();
    },
    methods: {
      tmpModHour(inc) {
        if (inc) {
          this.tmpHour++;
        } else {
          this.tmpHour--;
        }
        
        if (this.tmpHour == 0) {
          this.tmpHour = 12;
        }
        if (this.tmpHour == 13) {
          this.tmpHour = 1;
        }
        this.tmp();
      },
      tmpModMin(inc) {
        if (inc) {
          this.tmpMin = this.tmpMin + 5;
        } else {
          this.tmpMin = this.tmpMin - 5;
        }
        
        if (this.tmpMin == 0) {
          this.tmpMin = 60;
        }
        if (this.tmpMin == 65) {
          this.tmpMin = 5;
        }
        this.tmp();
      },
      tmp() {
        // hour = hour%12;
       
        //let absH = ((NUM_STEPS - this.hourPos) / NUM_STEPS) + 6;
        // this.tmpCalcNum(60);
        // this.tmpCalcNum(120);
        // this.tmpCalcNum(180);
        // this.tmpCalcNum(240);
        // this.tmpCalcNum(300);
        // this.tmpCalcNum(360);
        // this.tmpCalcNum(420);
        // this.tmpCalcNum(480);
        // this.tmpCalcNum(540);
        // this.tmpCalcNum(600);
        // this.tmpCalcNum(660);
        // this.tmpCalcNum(720);

        // minuteDec => i => 145,150,155,etc
        // minute => m => 155,145,140
        // encHour:-319,encMinute:312,encoder:true,hs:true,ms:true,hourMotor:530,minuteMotor:160,solved:false

        this.drawFace(this.ctx, this.radius);
        this.drawNumbers(this.ctx, this.radius);
        this.drawTime(this.ctx, this.radius, this.tmpCalcNum('hour', this.hourPos), this.tmpCalcNum('min', this.minPos) * 5);
      },
      tmpCalcNum(label, pos) {
        let frac = (pos / NUM_STEPS);
        let fracH = frac * 12;
        let absH =  6 - fracH;
        if (absH <= 0) {
          absH = 12 + absH;
        }

        console.log(`${label} ${pos} => ${absH}    frac:${frac} fracH:${fracH}`)

        return absH;
      },
      hourInc() {
        this.operations.add({ command: 'clock.hour' }).on("value", (snapshot) => {});
      },
      hourDec() {
        this.operations.add({ command: 'clock.hourDec' }).on("value", (snapshot) => {});
      },
      minuteInc() {
        this.operations.add({ command: 'clock.minute' }).on("value", (snapshot) => {});
      },
      minuteDec() {
        this.operations.add({ command: 'clock.minDec' }).on("value", (snapshot) => {});
      },

      drawFace(ctx, radius) {
        var grad;

        //draw white circle for the face
        ctx.beginPath();
        ctx.arc(0,0,radius,0,2*Math.PI);
        ctx.fillStyle = "White";
        ctx.fill();

        // create a radial gradient (inner, middle, and outer edge of clock)
        grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
        grad.addColorStop(0, '#9e9e9e');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#9e9e9e');

        // define gradient as stroke style
        //ctx.strokeStyle = "red";
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius*0.1;
        ctx.stroke(); 

        // draw the center of the clock
        ctx.beginPath();
        ctx.arc(0,0, radius*0.1,0,2*Math.PI);
        
        // #333
        ctx.fillStyle = '#000000de';
        ctx.fill();
      },

      drawNumbers(ctx, radius) {
        var ang;
        var num;
        ctx.font = radius*0.15 + "px arial"; //set font at 15% of radius
        ctx.textBaseline = "middle"; //set text alignment to middle
        ctx.textAlign = "center"; //set text alignment to center
        for(num=1; num < 13; num++){ //calculate the print position for each number
            ang = num *Math.PI /6;
            ctx.rotate(ang);
            ctx.translate(0, -radius*0.85 );
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius*0.85);
            ctx.rotate(-ang);
        }
      },

      drawTime(ctx, radius, hour, minute){        
        console.log(`hour: ${hour} min: ${minute}`);

        // calculate angle of hour hand
        hour = (hour*Math.PI/6);

        // minute
        // calculate angle of minute hand
        minute=(minute*Math.PI/30);

        // make minute hand 80% of canvas's radius
        this.drawHand(ctx, minute, radius*0.7, radius*0.07, "#eee");

        // make hour hand 50% of canvas's radius
        this.drawHand(ctx, hour, radius*0.5, radius*0.07, "#eee");
      },

      drawHand(ctx, pos, length, width, color){
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);

        // todo: make green on solve
        ctx.strokeStyle = "#000000de";
        ctx.stroke();
        ctx.rotate(-pos);
      }
    }
  }
</script>

<style scoped>
</style>


<template>
<div>
  <div class="actionRow" style="padding-left:15px;font-size:18px;font-weight:400;">
    <canvas id="clockCanvas" width="200" height="200" style=""></canvas>
  </div>
</div>
</template>

<script>
  const NUM_STEPS = 720
  export default {
    props: ['hourPos', 'minPos'],

    data: () => ({
      ctx: null,
      radius: 0,
    }),
    computed: {},
    watch: {
      hourPos: function(newTime) {
        this.draw();
      },
      minPos: function(newTime) {
        this.draw();
      },
    },
    created() {},
    mounted() {
      let canvas = document.getElementById('clockCanvas');    
      this.ctx = canvas.getContext('2d');
      this.radius = canvas.height / 2;
      this.ctx.translate(this.radius, this.radius);
      this.radius = this.radius * 0.90;

      this.draw();
    },
    methods: {
      draw() {
        this.drawFace(this.ctx, this.radius);
        this.drawNumbers(this.ctx, this.radius);
        this.drawTime(
          this.ctx,
          this.radius,
          this.calcPosition('hour', this.hourPos),
          this.calcPosition('min', this.minPos) * 5);
      },
      calcPosition(label, motorPos) {
        let pos =  6 - ((motorPos / NUM_STEPS) * 12);
        if (pos <= 0) {
          pos = 12 + pos;
        }

        // console.log(`${label} ${motorPos} => ${pos}`)
        return pos;
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


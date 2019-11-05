<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <input type="file" v-on:change="imgChange"/>
        <canvas ref="canvas" :width="canvasSize.width" :height="canvasSize.height" style="padding-top:15px;"
          v-on:mousedown="down" 
          v-on:mouseup="up" 
          v-on:mousemove="move" 
        />
        <canvas ref="expCanvas" width="100" height="80" style="display:none;" />
        <v-btn small color="primary" @click.native="exportImg">export</v-btn>
        <v-btn small color="primary" @click.native="scale(true)">up</v-btn>
        <v-btn small color="primary" @click.native="scale(false)">down</v-btn>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>

export default {
  data () {
    return {
      dragging: false,
      imgSize: 0,
      imageLoaded: false,
      canvasSize: {
        width: 678,
        height: 384
      },
      imgSize: { 
        width: 678, 
        height:384 
      },
      position: { x: 10, y: 10 },
      size: { width: 100, height: 80 },
      lastPoint: { x: -1, y: -1 },
      img: document.createElement('img')
    }
  },
  mounted() {
    // note: I was resizing to 1356x768, for resize purposed 339x192
    //   
    this.loadImg('/static/museum/sampleImage.png')
  },
  methods: {
    imgChange(e) {
      let URL = window.URL;
      let url = URL.createObjectURL(e.target.files[0]);
      this.loadImg(url);
    },

    loadImg(img_url) {
      this.img.src = img_url
      this.img.onload = () => {
        this.imageLoaded = true;
        this.draw();
      }
    },

    exportImg() {
      let imgData = this.$refs.canvas.getContext('2d').getImageData(this.position.x, this.position.y, this.size.width, this.size.height);    
      let exp = this.$refs.expCanvas;
      let ctx = exp.getContext('2d');
      ctx.putImageData(imgData, 0, 0);

      let img = new Image();
      img.src = exp.toDataURL();
      document.body.appendChild(img);
    },

    draw() {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext("2d");
      
      if (this.imageLoaded) {
        // draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.img, 0, 0, this.imgSize.width, this.imgSize.height);

        // draw rectangle
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.stroke();
      }
    },

    scale(up) {
      const scale_perc = 1.1;
      if (up) {
        this.imgSize = { width: this.imgSize.width * scale_perc, height: this.imgSize.height * scale_perc };
      } else {
        this.imgSize = { width: this.imgSize.width / scale_perc, height: this.imgSize.height / scale_perc };
      }
      
      this.draw();
    },

    down(e) {
      let x = e.pageX - e.target.offsetLeft;
      let y = e.pageY - e.target.offsetTop;

      // find out if rect was clicked
      if ( (x > this.position.x && x < this.position.x + this.size.width) && 
           (y > this.position.y && y < this.position.y + this.size.height)) {
        this.dragging = true;
        this.lastPoint.x = x;
        this.lastPoint.y = y;
      }

      e.preventDefault();
    },

    up(e) {
      if (this.dragging) {
        this.dragging = false;
        this.lastPoint.x = -1;
        this.lastPoint.y = -1;
      }
    },

    move(e) {
      if (!this.dragging) {
        return;
      }

      let x = e.pageX - e.target.offsetLeft;
      let y = e.pageY - e.target.offsetTop;
      let deltaX = x - this.lastPoint.x;
      let deltaY = y - this.lastPoint.y;

      this.position.x += deltaX
      this.position.y += deltaY

      // check for boundary
      let maxX = (this.imgSize.width - this.size.width - 1);
      this.position.x = this.position.x < 1 ? 1 : this.position.x;
      this.position.x = this.position.x > maxX ? maxX : this.position.x;

      let maxY = (this.imgSize.height - this.size.height - 1);
      this.position.y = this.position.y < 1 ? 1 : this.position.y;
      this.position.y = this.position.y > maxY ? maxY : this.position.y;

      this.lastPoint.x = x;
      this.lastPoint.y = y;

      this.draw();
    }
  }
}
</script>
<style scoped>
</style>

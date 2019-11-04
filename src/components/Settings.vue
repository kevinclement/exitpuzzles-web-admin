<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <input type="file" id="selectedImage" v-on:change="imgChange"/>
        <canvas id="myCanvas" width="500" height="500"
          v-on:mousedown="down" 
          v-on:mouseup="up" 
          v-on:mousemove="move" 
        />
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>

let img = document.createElement('img');

export default {
  data () {
    return {
      dragging: false,
      imgSize: 0,
      imageLoaded: false,
      position: { x: 20, y: 20 },
      size: { width: 150, height: 100 },
      lastPoint: { x: -1, y: -1 }
    }
  },
  mounted() {
    this.loadImg('/static/museum/sampleImage.png')
  },
  methods: {
    imgChange(e) {
      var URL = window.URL;
      var url = URL.createObjectURL(e.target.files[0]);
      this.loadImg(url);
    },

    loadImg(img_url) {
      img.src = img_url
      img.onload = () => {
        var canvas = document.getElementById("myCanvas");
        this.imgSize = this.calculateAspectRatioFit(img.width, img.height, canvas.clientWidth, canvas.clientHeight);
        this.imageLoaded = true;
        this.draw();
      }
    },

    draw() {
      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      
      if (this.imageLoaded) {
        // draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, this.imgSize.width, this.imgSize.height);

        // draw rectangle
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.stroke();
      }
    },

    down(e) {
      var x = e.pageX - e.target.offsetLeft;
      var y = e.pageY - e.target.offsetTop;

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

      var x = e.pageX - e.target.offsetLeft;
      var y = e.pageY - e.target.offsetTop;
      var deltaX = x - this.lastPoint.x;
      var deltaY = y - this.lastPoint.y;

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
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      var rtnWidth = srcWidth * ratio;
      var rtnHeight = srcHeight * ratio;
      return {
          width: rtnWidth,
          height: rtnHeight
      };
    }
  }
}
</script>
<style scoped>
</style>

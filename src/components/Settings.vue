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

let dragging = false;
let imgSize = 0;
let img = document.createElement('img');
let imageLoaded = false;
let position = { x: 20, y: 20 }
let size = { width: 150, height: 100 }
let lastPoint = { x: -1, y: -1 }

export default {
  data () {
    return {
    }
  },
  mounted() {
    loadImg('/static/museum/sampleImage.png')
  },
  methods: {
    imgChange(e) {
      var URL = window.URL;
      var url = URL.createObjectURL(e.target.files[0]);
      loadImg(url);
    },

    down(e) {
      var x = e.pageX - e.target.offsetLeft;
      var y = e.pageY - e.target.offsetTop;

      // find out if rect was clicked
      if ( (x > position.x && x < position.x + size.width) && 
          (y > position.y && y < position.y + size.height)) {
        dragging = true;
        lastPoint.x = x;
        lastPoint.y = y;
      }

      e.preventDefault();
    },
    up(e) {
      if (dragging) {
        dragging = false;
        lastPoint.x = -1;
        lastPoint.y = -1;
      }
    },
    move(e) {
      if (!dragging) {
        return;
      }

      var x = e.pageX - e.target.offsetLeft;
      var y = e.pageY - e.target.offsetTop;
      var deltaX = x - lastPoint.x;
      var deltaY = y - lastPoint.y;

      position.x += deltaX
      position.y += deltaY

      // check for boundary
      let maxX = (imgSize.width - size.width - 1);
      position.x = position.x < 1 ? 1 : position.x;
      position.x = position.x > maxX ? maxX : position.x;

      let maxY = (imgSize.height - size.height - 1);
      position.y = position.y < 1 ? 1 : position.y;
      position.y = position.y > maxY ? maxY : position.y;

      lastPoint.x = x;
      lastPoint.y = y;

      draw();
    }
  }
}

function loadImg(img_url) {
  img.src = img_url
  img.onload = function() {
    var canvas = document.getElementById("myCanvas");
    imgSize = calculateAspectRatioFit(img.width, img.height, canvas.clientWidth, canvas.clientHeight);
    imageLoaded = true;
    draw();
  }
}

function draw() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  
  if (imageLoaded) {
    // draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, imgSize.width, imgSize.height);

    // draw rectangle
    ctx.beginPath();
    ctx.rect(position.x, position.y, size.width, size.height);
    ctx.stroke();
  }
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    var rtnWidth = srcWidth * ratio;
    var rtnHeight = srcHeight * ratio;
    return {
        width: rtnWidth,
        height: rtnHeight
    };
}
</script>
<style scoped>
</style>

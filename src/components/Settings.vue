<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <input type="file" id="selectedImage" v-on:change="imgChange"/>
        <canvas id="myCanvas" width="500" height="500"> </canvas>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
let rectX = 20;
let rectY = 20;
const rectWidth = 150;
const rectHeight = 100;
let dragging = false;

export default {
  data () {
    return {
    }
  },
  mounted() {
    loadImg('/static/museum/sampleImage.png')

    document.getElementById("myCanvas").addEventListener("mousedown", mouseDownListener, false);
    document.getElementById("myCanvas").addEventListener("mouseup", mouseUpListener, false);
    document.getElementById("myCanvas").addEventListener("mousemove", mouseMoveListener, false);
  },
  methods: {
    imgChange(e) {
      console.log(`changed`);
      var URL = window.URL;
      var url = URL.createObjectURL(e.target.files[0]);
      loadImg(url);
    }
  }
}

let imgSize = 0;
let img = document.createElement('img');
let imageLoaded = false;
let lastPoint = { x: -1, y: -1 }

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
    ctx.rect(rectX, rectY, rectWidth, rectHeight);
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

function mouseMoveListener(e) {
    if (!dragging) {
      return;
    }

    let canvas = document.getElementById("myCanvas");
    
    var x = e.pageX - e.target.offsetLeft;
    var y = e.pageY - e.target.offsetTop;
    var deltaX = x - lastPoint.x;
    var deltaY = y - lastPoint.y;

    // var posX;
    // var posY;

    // var minX = rectX;
    // var maxX = canvas.width - rectWidth;
    // var minY = rectY;
    // var maxY = canvas.height - rectHeight;

    // getting mouse position correctly, being mindful of resizing that may have occured in the browser:
    // let bRect = canvas.getBoundingClientRect();
    // let mouseX = (e.clientX - bRect.left)*(canvas.width/bRect.width);
    // let mouseY = (e.clientY - bRect.top)*(canvas.height/bRect.height);

    // clamp x and y positions to prevent object from dragging outside of canvas
    //posX = mouseX - rectX;
    // posX = mouseX - lastx;
    // //posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
    // posY = mouseY - lasty;
    //posY = mouseY - rectY;
    //posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
    
    rectX += deltaX
    rectY += deltaY

    lastPoint.x = x;
    lastPoint.y = y;

    draw();
}

function mouseDownListener(e) {
    let canvas = document.getElementById("myCanvas");

    // getting mouse position correctly, being mindful of resizing that may have occured in the browser:
    let bRect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - bRect.left)*(canvas.width/bRect.width);
    let mouseY = (e.clientY - bRect.top)*(canvas.height/bRect.height);
  
    var x = e.pageX - e.target.offsetLeft;
    var y = e.pageY - e.target.offsetTop;

    // find out if rect was clicked
    if ( (mouseX > rectX && mouseX < rectX + rectWidth) && 
         (mouseY > rectY && mouseY < rectY + rectHeight)) {

      dragging = true;
      lastPoint.x = x;
      lastPoint.y = y;
    }
    
    e.preventDefault();
}
function mouseUpListener(e) {
  if (dragging) {
    dragging = false;
    lastPoint.x = -1;
    lastPoint.y = -1;
  }
}
</script>
<style scoped>
</style>

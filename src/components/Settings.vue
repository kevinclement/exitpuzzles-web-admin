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
export default {
  data () {
    return {
    }
  },
  methods: {
    imgChange(e) {
      console.log(`changed`);
      var URL = window.URL;
      var url = URL.createObjectURL(e.target.files[0]);

      let img = document.createElement('img')
      img.src = url;

      img.onload = function() {
        var canvas = document.getElementById("myCanvas");

        var ctx = canvas.getContext("2d");
        var imgSize = calculateAspectRatioFit(img.width, img.height, canvas.clientWidth, canvas.clientHeight);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, imgSize.width, imgSize.height);
        
        // rectangle
        ctx.beginPath();
        ctx.rect(20, 20, 150, 100);
        ctx.stroke();
      }
    }
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

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
        <canvas ref="expCanvasZoom" width="100" height="80" style="display:none;" />
        <canvas ref="expCanvasSized" width="1356" height="768" style="display:none" />
        <v-btn small color="primary" @click.native="exportImg">export</v-btn>
        <v-btn small color="primary" @click.native="scale(true)">up</v-btn>
        <v-btn small color="primary" @click.native="scale(false)">down</v-btn>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>

const DEFAULTS = {
  display_w: 339,
  display_h: 192,

  export_w: 1356,
  export_h: 768
}

export default {
  data () {
    return {
      dragging: false,
      imgSize: 0,
      imageLoaded: false,
      canvasSize: {
        width: DEFAULTS.display_w,
        height: DEFAULTS.display_h
      },
      imgSize: { 
        width: DEFAULTS.display_w,
        height: DEFAULTS.display_h
      },
      position: { x: 10, y: 10 },
      size: { width: 100, height: 80 },
      lastPoint: { x: -1, y: -1 },
      img: document.createElement('img'),
      imgName: ""
    }
  },
  created() {
    this.storage = this.$root.$data.fbstorage.ref()
  },
  mounted() {
    this.loadImg('/static/museum/sampleImage.png', 'sampleImage.png')
  },
  methods: {
    imgChange(e) {
      let URL = window.URL;
      let url = URL.createObjectURL(e.target.files[0]);
      this.loadImg(url, e.target.files[0].name);
    },

    loadImg(img_url, name) {
      // store image name without extension, e.g. foo.png -> foo
      this.imgName = name.split('.').slice(0,-1).join()
      this.img.src = img_url
      this.img.onload = () => {
        this.imageLoaded = true;
        this.draw(true);
      }
    },

    exportImg() {
      // zoomed image
      let canvas = this.$refs.canvas.getContext('2d');
      let exp = this.$refs.expCanvasZoom;
      let ctx = exp.getContext('2d');
      let zoomData = canvas.getImageData(this.position.x, this.position.y, this.size.width, this.size.height);
      ctx.putImageData(zoomData, 0, 0);
      let zoomImg = new Image();
      let dataURI = exp.toDataURL();
      zoomImg.src = dataURI;
      document.body.appendChild(zoomImg);

      // upload small image to storage
      this.uploadToStorage(dataURI, 'small')

      // resized image
      let resizeImg = new Image();
      let resizeURI = this.$refs.expCanvasSized.toDataURL();
      resizeImg.src = resizeURI;
      document.body.appendChild(resizeImg);

      // upload full image to storage
      this.uploadToStorage(resizeURI, 'full')
    },

    draw(fresh) {
      let canvas = this.$refs.canvas;
      let canvasSized = this.$refs.expCanvasSized;
      let ctx = canvas.getContext("2d");
      let ctxSized = canvasSized.getContext("2d");
      
      if (this.imageLoaded) {
        // draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.img, 0, 0, this.imgSize.width, this.imgSize.height);

        // draw rectangle
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.stroke();

        // draw the resized image if this is a new load
        if (fresh) {
          ctxSized.clearRect(0, 0, DEFAULTS.export_w, DEFAULTS.export_h);
          ctxSized.drawImage(this.img, 0, 0, DEFAULTS.export_w, DEFAULTS.export_h);
        }
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
    },

    uploadToStorage(dataURI, ext) {
      let filename = `${this.imgName}.${ext}.png`;
      let fileRef = this.storage.child('museum/clues').child(filename);
      fileRef.putString(dataURI, 'data_url', { contentType: 'image/png' }).then(function(snapshot) {
        console.log(`uploaded ${filename}`);
      });
    }
  }
}
</script>
<style scoped>
</style>

<template>
  <v-container fluid style="padding-top:0px !important;padding-bottom:0px !important;">
    <v-layout row wrap>
      <div class="zoomRow" style="">
        <v-icon :disabled="!showCanvas" v-on:click="scale(false)">zoom_out</v-icon>
        <v-icon :disabled="!showCanvas" v-on:click="scale(true)">zoom_in</v-icon>
      </div>
      <label>
        <input type="file" accept="image/*" v-on:change="imgChange" style="display:none">
        <div v-if="!showCanvas" style="height: 192px;width:339px;background:#f5f5f5;display: flex;align-items: center;justify-content: center;flex-flow:column wrap;">
          <div><v-icon style="font-size:42px;color:rgba(0, 0, 0, 0.38);">cloud_upload</v-icon></div>
          <div style="color:rgba(0, 0, 0, 0.38);">Upload Image</div>
        </div>
      </label>
    <canvas v-if="showCanvas" ref="canvas" :width="canvasSize.width" :height="canvasSize.height" style=""
        v-on:mousedown="down" 
        v-on:mouseup="up" 
        v-on:mousemove="move" 
    />
    <div style="width:400px;padding-top:10px;font-style:italic;">{{desc}}</div>
    
    <!-- hidden canvas elements used to produce zoom and resized images -->
    <canvas ref="expCanvasZoom" width="100" height="80" style="display:none;" />
    <canvas ref="expCanvasSized" width="1356" height="768" style="display:none" />

    <!-- <v-btn small color="primary" @click.native="exportImg">export</v-btn> -->
    </v-layout>
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
      showCanvas: false,
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
  computed: {
    desc: function() {
      if (this.showCanvas) {
        return "Move selection to highlight shortcut image.  Use zoom for a better selection."
      } else {
        return "Click to upload image from your computer."
      }
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
      this.showCanvas = true;
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

      // upload small image to storage
      this.uploadToStorage(dataURI, 'small')

      // resized image
      let resizeImg = new Image();
      let resizeURI = this.$refs.expCanvasSized.toDataURL();
      resizeImg.src = resizeURI;

      // upload full image to storage
      this.uploadToStorage(resizeURI, 'full')
    },

    draw(fresh) {
      if (!this.showCanvas) return

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
      let canvas = this.$refs.canvas;
      var bRect = canvas.getBoundingClientRect();
      let x = (e.clientX - bRect.left)*(canvas.width/bRect.width);
      let y = (e.clientY - bRect.top)*(canvas.height/bRect.height);

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

      let canvas = this.$refs.canvas;
      var bRect = canvas.getBoundingClientRect();
      let x = (e.clientX - bRect.left)*(canvas.width/bRect.width);
      let y = (e.clientY - bRect.top)*(canvas.height/bRect.height);

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
.zoomRow {
  width:339px;
  padding-bottom:2px;
  user-select: none;
}
.zoomRow i {
  cursor: pointer;
}
</style>

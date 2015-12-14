(function() {
  var WebGLAnimation, fs;

  fs = require('fs');

  WebGLAnimation = (function() {
    WebGLAnimation.prototype.ytid = '';

    WebGLAnimation.prototype.homeDir = '';

    WebGLAnimation.prototype.videoDir = '';

    WebGLAnimation.prototype.animPath = '';

    WebGLAnimation.prototype.frames = [];

    WebGLAnimation.prototype.currentFrame = 0;

    WebGLAnimation.prototype.fadeOut = 50;

    function WebGLAnimation(ytid) {
      var url;
      this.loaded = 0;
      this.playing = false;
      this.speed = atom.config.get('editor-background.animationSpeed');
      atom.config.observe('editor-background.animationSpeed', (function(_this) {
        return function(speed) {
          return _this.setSpeed(speed);
        };
      })(this));
      this.homeDir = atom.packages.resolvePackagePath('editor-background');
      this.videoDir = this.homeDir + '/youtube-videos';
      if (ytid != null) {
        this.ytid = ytid;
      } else {
        url = atom.config.get('editor-background.youTubeUrl');
        if (url != null) {
          this.ytid = this.getYTid(url);
        }
      }
      if (this.ytid) {
        this.animPath = this.videoDir + '/' + this.ytid + '_images/';
      }
    }

    WebGLAnimation.prototype.setSpeed = function(speed) {
      return this.speed = speed;
    };

    WebGLAnimation.prototype.getYTId = function(url) {
      var ytid, ytidregres, ytreg;
      if (url !== '') {
        ytreg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/]{11})/i;
        ytidregres = ytreg.exec(url);
        if ((ytidregres != null ? ytidregres.length : void 0) > 0) {
          return ytid = ytidregres[1];
        }
      }
    };

    WebGLAnimation.prototype.imageLoaded = function(file, img, event) {
      this.loaded++;
      if (this.loaded === this.frames.length) {
        this.createCanvas();
        this.naturalWidth = img.naturalWidth;
        this.naturalHeight = img.naturalHeight;
        this.playing = true;
        return this.animate();
      }
    };

    WebGLAnimation.prototype.addFrame = function(file) {
      var img;
      img = new Image();
      img.addEventListener('load', (function(_this) {
        return function(event) {
          return _this.imageLoaded.apply(_this, [file, img, event]);
        };
      })(this));
      img.src = this.animPath + file;
      return this.frames.push(img);
    };

    WebGLAnimation.prototype.start = function(element, before) {
      var e;
      this.frames = [];
      this.element = element;
      this.before = before;
      try {
        return fs.readdir(this.animPath, (function(_this) {
          return function(err, files) {
            var file, reg, _i, _len, _results;
            if (err) {
              return console.log(err);
            } else {
              reg = /^[0-9]+\.jpg$/;
              files.sort(function(a, b) {
                return parseInt(reg.exec(a)) - parseInt(reg.exec(b));
              });
              _results = [];
              for (_i = 0, _len = files.length; _i < _len; _i++) {
                file = files[_i];
                _results.push(_this.addFrame(file));
              }
              return _results;
            }
          };
        })(this));
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    };

    WebGLAnimation.prototype.drawFrame = function() {
      var alpha, diff, frame, index, lastFrame;
      if (this.currentFrame + 1 >= (this.frames.length - this.fadeOut)) {
        this.currentFrame = 0;
      }
      if (this.currentFrame < this.fadeOut) {
        lastFrame = this.frames.length - 1;
        diff = this.fadeOut - this.currentFrame;
        index = lastFrame - diff;
        alpha = parseFloat((diff / this.fadeOut).toFixed(2));
      }
      frame = this.frames[this.currentFrame];
      this.ctx.globalAlpha = 1;
      this.ctx.drawImage(frame, 0, 0);
      if (this.currentFrame < this.fadeOut) {
        this.ctx.globalAlpha = alpha;
        this.ctx.drawImage(this.frames[index], 0, 0);
      }
      return this.currentFrame++;
    };

    WebGLAnimation.prototype.animate = function() {
      if (this.playing) {
        this.drawFrame();
        return setTimeout((function(_this) {
          return function() {
            return _this.animate();
          };
        })(this), this.speed);
      }
    };

    WebGLAnimation.prototype.createCanvas = function() {
      var bdW, bdW_, body, buffer, fragmentShader, height, height2, positionLocation, program, ratio, vertexShader, width, width2;
      this.canvas = document.createElement('canvas');
      width = this.frames[0].naturalWidth;
      height = this.frames[0].naturalHeight;
      this.canvas.width = width;
      this.canvas.height = height;
      width2 = Math.floor(width / 2);
      height2 = Math.floor(height / 2);
      body = document.querySelector('body');
      bdW_ = window.getComputedStyle(body).width;
      bdW = /([0-9]+)/gi.exec(bdW_)[1];
      ratio = (bdW / width).toFixed(2);
      this.canvas.className = 'editor-background-animation';
      this.canvas.style.cssText = "position:absolute; left:calc(50% - " + width2 + "px); top:calc(50% - " + height2 + "px); width:" + width + "px; height:" + height + "px; transform:scale(" + ratio + ") translate3d(0,0,0);";
      atom.config.observe('editor-background.blurRadius', (function(_this) {
        return function(radius) {
          return _this.canvas.style.webkitFilter = "blur(" + radius + "px)";
        };
      })(this));
      this.ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
      fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
      program = createProgram(gl, [vertexShader, fragmentShader]);
      gl.useProgram(program);
      positionLocation = gl.getAttribLocation(program, "a_position");
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      if (this.before != null) {
        return this.element.insertBefore(this.canvas, this.before);
      } else {
        return this.element.appendChild(this.canvas);
      }
    };

    WebGLAnimation.prototype.stop = function() {
      this.canvas.remove();
      this.frames = [];
      return this.currentFrame = 0;
    };

    return WebGLAnimation;

  })();

  module.exports = Animation;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZWRpdG9yLWJhY2tncm91bmQvbGliL3dlYmdsQW5pbWF0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFFTTtBQUVKLDZCQUFBLElBQUEsR0FBSyxFQUFMLENBQUE7O0FBQUEsNkJBQ0EsT0FBQSxHQUFRLEVBRFIsQ0FBQTs7QUFBQSw2QkFFQSxRQUFBLEdBQVMsRUFGVCxDQUFBOztBQUFBLDZCQUdBLFFBQUEsR0FBUyxFQUhULENBQUE7O0FBQUEsNkJBSUEsTUFBQSxHQUFPLEVBSlAsQ0FBQTs7QUFBQSw2QkFLQSxZQUFBLEdBQWEsQ0FMYixDQUFBOztBQUFBLDZCQU1BLE9BQUEsR0FBUSxFQU5SLENBQUE7O0FBU2EsSUFBQSx3QkFBQyxJQUFELEdBQUE7QUFDWCxVQUFBLEdBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBRlQsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGtDQUFwQixFQUF1RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7aUJBQ3JELEtBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQURxRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZELENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE9BQUQs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

//# sourceURL=/C:/Users/soviet/.atom/packages/editor-background/lib/webglAnimation.coffee
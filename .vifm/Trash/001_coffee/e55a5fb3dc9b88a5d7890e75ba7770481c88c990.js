(function() {
  var Animation, fs, path;

  fs = require('fs');

  path = require('path');

  Animation = (function() {
    Animation.prototype.ytid = '';

    Animation.prototype.homeDir = '';

    Animation.prototype.videoDir = '';

    Animation.prototype.animPath = '';

    Animation.prototype.frames = [];

    Animation.prototype.currentFrame = 0;

    Animation.prototype.fadeOut = 50;

    Animation.prototype.canvas = void 0;

    function Animation(ytid) {
      var url;
      this.loaded = 0;
      this.playing = false;
      this.speed = atom.config.get('editor-background.video.animationSpeed');
      atom.config.observe('editor-background.video.animationSpeed', (function(_this) {
        return function(speed) {
          return _this.setSpeed(speed);
        };
      })(this));
      atom.config.observe('editor-background.video.opacity', (function(_this) {
        return function(opacity) {
          var vOpacity, _ref;
          vOpacity = (opacity / 100).toFixed(2);
          if (((_ref = _this.canvas) != null ? _ref.style : void 0) != null) {
            return _this.canvas.style.opacity = vOpacity;
          }
        };
      })(this));
      this.homeDir = atom.packages.resolvePackagePath('editor-background');
      if (!this.homeDir) {
        this.homeDir = path.resolve(__dirname);
      }
      this.videoDir = this.homeDir + '/youtube-videos';
      if (ytid != null) {
        this.ytid = ytid;
      } else {
        url = atom.config.get('editor-background.video.youTubeUrl');
        if (url != null) {
          this.ytid = this.getYTid(url);
        }
      }
      if (this.ytid) {
        this.animPath = this.videoDir + '/' + this.ytid + '_images/';
      }
    }

    Animation.prototype.setSpeed = function(speed) {
      return this.speed = speed;
    };

    Animation.prototype.getYTId = function(url) {
      var ytid, ytidregres, ytreg;
      if (url !== '') {
        ytreg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/]{11})/i;
        ytidregres = ytreg.exec(url);
        if ((ytidregres != null ? ytidregres.length : void 0) > 0) {
          return ytid = ytidregres[1];
        }
      }
    };

    Animation.prototype.imageLoaded = function(file, img, event) {
      this.loaded++;
      if (this.loaded === this.frames.length) {
        this.createCanvas();
        this.naturalWidth = img.naturalWidth;
        this.naturalHeight = img.naturalHeight;
        this.playing = true;
        return this.animate();
      }
    };

    Animation.prototype.addFrame = function(file) {
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

    Animation.prototype.start = function(element, before) {
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

    Animation.prototype.drawFrame = function() {
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

    Animation.prototype.animate = function() {
      if (this.playing) {
        this.drawFrame();
        return this.player = setTimeout((function(_this) {
          return function() {
            return _this.animate();
          };
        })(this), this.speed);
      }
    };

    Animation.prototype.createCanvas = function() {
      var bdW, bdW_, body, height, height2, ratio, vOpacity, width, width2, _vOpacity;
      if (this.canvas == null) {
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
        _vOpacity = atom.config.get('editor-background.video.opacity');
        vOpacity = (_vOpacity / 100).toFixed(2);
        this.canvas.style.cssText = "position:absolute; left:calc(50% - " + width2 + "px); top:calc(50% - " + height2 + "px); width:" + width + "px; height:" + height + "px; transform:scale(" + ratio + ") translate3d(0,0,0); opacity:" + vOpacity + ";";
        atom.config.observe('editor-background.image.blur', (function(_this) {
          return function(radius) {
            return _this.canvas.style.webkitFilter = "blur(" + radius + "px)";
          };
        })(this));
        this.ctx = this.canvas.getContext('2d');
        if (this.before != null) {
          return this.element.insertBefore(this.canvas, this.before);
        } else {
          return this.element.appendChild(this.canvas);
        }
      }
    };

    Animation.prototype.stop = function() {
      if (this.player != null) {
        clearTimeout(this.player);
      }
      if (this.canvas != null) {
        this.canvas.remove();
      }
      this.frames = [];
      this.currentFrame = 0;
      return this.playing = false;
    };

    return Animation;

  })();

  module.exports = Animation;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZWRpdG9yLWJhY2tncm91bmQvbGliL2FuaW1hdGlvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdNO0FBRUosd0JBQUEsSUFBQSxHQUFLLEVBQUwsQ0FBQTs7QUFBQSx3QkFDQSxPQUFBLEdBQVEsRUFEUixDQUFBOztBQUFBLHdCQUVBLFFBQUEsR0FBUyxFQUZULENBQUE7O0FBQUEsd0JBR0EsUUFBQSxHQUFTLEVBSFQsQ0FBQTs7QUFBQSx3QkFJQSxNQUFBLEdBQU8sRUFKUCxDQUFBOztBQUFBLHdCQUtBLFlBQUEsR0FBYSxDQUxiLENBQUE7O0FBQUEsd0JBTUEsT0FBQSxHQUFRLEVBTlIsQ0FBQTs7QUFBQSx3QkFPQSxNQUFBLEdBQU8sTUFQUCxDQUFBOztBQVVhLElBQUEsbUJBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSxHQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixDQUZULENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix3Q0FBcEIsRUFBNkQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO2lCQUMzRCxLQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsRUFEMkQ7UUFB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

//# sourceURL=/C:/Users/soviet/.atom/packages/editor-background/lib/animation.coffee

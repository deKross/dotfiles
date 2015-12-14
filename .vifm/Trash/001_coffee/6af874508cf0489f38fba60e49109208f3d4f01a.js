(function() {
  var CompositeDisposable, EditorBackground, animation, blobToBase64, blur, colorToArray, configWindow, escapeHTML, fs, inline, path, planeInitialCss, popup, qr, shadowDomAlert, shadowDomEnabled, style, yt;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs');

  blur = require('./StackBlur.js');

  animation = require('./animation');

  yt = require('./youtube');

  popup = require('./popup');

  configWindow = require('./config');

  path = require('path');

  qr = function(selector) {
    return document.querySelector(selector);
  };

  style = function(element) {
    return document.defaultView.getComputedStyle(element);
  };

  inline = function(element, style) {
    return element.style.cssText += style;
  };

  escapeHTML = function(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  blobToBase64 = function(blob, cb) {
    var reader;
    reader = new FileReader();
    reader.onload = function() {
      var base64, dataUrl;
      dataUrl = reader.result;
      base64 = dataUrl.split(',')[1];
      return cb(base64);
    };
    return reader.readAsDataURL(blob);
  };

  shadowDomEnabled = atom.config.get('editor.useShadowDOM');

  shadowDomAlert = false;

  planeInitialCss = "position:absolute; left:0; top:0; width:100%; height:100%; background:transparent; pointer-events:none; z-index:0;";

  colorToArray = function(str) {
    var result;
    result = str.replace(/[^\d,\.]/g, '');
    result = result.split(',');
    return result;
  };

  module.exports = EditorBackground = {
    config: {
      useConfigWindow: {
        type: 'string',
        description: "USE PACKAGE CONFIG WINDOW INSTEAD OF THIS SETTINGS ( CTRL + SHIFT + E ) TO OPEN",
        toolbox: 'ignore',
        "default": '',
        order: 0
      },
      image: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            toolbox: 'file',
            title: 'Image URL',
            "default": 'atom://editor-background/bg.jpg',
            description: "URL of your image. It can be http://... or just /home/yourname/image.jpg"
          },
          blurRadius: {
            type: 'integer',
            description: "Background image blur. 0 = none",
            "default": 0,
            minimim: 0,
            maximum: 200
          },
          backgroundSize: {
            type: "string",
            "default": "original",
            "enum": ["original", "100%", "cover", "manual"],
            description: "Background size"
          },
          manualBackgroundSize: {
            type: "string",
            "default": "",
            description: "'100px 100px' or '50%' try something..."
          },
          backgroundPosition: {
            type: "string",
            "default": "center",
            description: "Background position"
          },
          repeat: {
            type: "string",
            "default": "no-repeat",
            "enum": ["no-repeat", "repeat", "repeat-x", "repeat-y"],
            description: "Background repeat"
          },
          customOverlayColor: {
            type: "boolean",
            "default": false,
            description: "Do you want different color on top of background?"
          },
          overlayColor: {
            type: 'color',
            "default": 'rgba(0,0,0,0)',
            description: "Color used to overlay background image"
          },
          opacity: {
            type: 'integer',
            "default": 100,
            description: "Background image visibility percent 1-100",
            minimum: 0,
            maximum: 100
          },
          style: {
            type: "string",
            toolbox: "text",
            "default": "background:radial-gradient(rgba(0,0,0,0) 30%,rgba(0,0,0,0.75));",
            description: "Your custom css rules :]"
          }
        }
      },
      text: {
        type: 'object',
        properties: {
          color: {
            type: "color",
            "default": "rgba(0,0,0,1)",
            description: "background color for text/code"
          },
          opacity: {
            type: "integer",
            "default": 100,
            minimum: 0,
            maximum: 100
          },
          blur: {
            type: "integer",
            "default": 5,
            minimum: 0,
            maximum: 50
          },
          expand: {
            type: "integer",
            "default": 4,
            description: "If you want larger area under text - try 4 or 10",
            minimum: 0,
            maximum: 200
          },
          shadow: {
            type: "string",
            "default": "none",
            description: "Add a little text shadow to code like '0px 2px 2px rgba(0,0,0,0.3)' "
          }
        }
      },
      video: {
        type: 'object',
        properties: {
          youTubeURL: {
            type: 'string',
            "default": '',
            description: "Search for 'background loop', 'background animation' or similar on youtube and paste url here."
          },
          playAnimation: {
            type: "boolean",
            "default": false,
            description: "enable or disable animation"
          },
          animationSpeed: {
            type: "integer",
            "default": 75,
            description: "animation speed in ms (original is 50), LOWER VALUE = HIGHER CPU USAGE"
          },
          opacity: {
            type: "integer",
            "default": 75,
            minimum: 0,
            maximum: 100,
            description: "video opacity"
          },
          startTime: {
            type: "string",
            "default": '0s',
            description: "video start time like 1h30m10s or 10s"
          },
          endTime: {
            type: "string",
            "default": "20s",
            description: "video end time like 1h30m30s or 30s"
          }
        }
      },
      other: {
        type: 'object',
        properties: {
          treeViewOpacity: {
            type: 'integer',
            "default": "35",
            description: "Tree View can be transparent too :)",
            minimum: 0,
            maximum: 100
          },
          transparentTabBar: {
            type: "boolean",
            "default": true,
            desctiption: "Transparent background under file tabs"
          }
        }
      },
      box3d: {
        type: 'object',
        properties: {
          depth: {
            type: "integer",
            "default": 0,
            minimum: 0,
            maximum: 2000,
            description: "This is pseudo 3D Cube. Try 500 or 1500 or something similar..."
          },
          shadowOpacity: {
            type: "integer",
            "default": 30,
            minimum: 0,
            maximum: 100,
            description: "shadow that exists in every corner of the box"
          },
          mouseFactor: {
            type: "integer",
            "default": 0,
            description: "move background with mouse (higher value = slower) try 8 or 4 for 3dbox or 20 for wallpaper"
          }
        }
      }
    },
    packagesLoaded: false,
    initialized: false,
    elements: {},
    colors: {},
    state: {},
    mouseX: 0,
    mouseY: 0,
    editorStyles: [],
    editor: {},
    activate: function(state) {
      if (!shadowDomEnabled) {
        if (!shadowDomAlert) {
          atom.notifications.add('warning', 'Use Shadow DOM option must be enabled to run editor-background');
        }
        return;
      }
      this.subs = new CompositeDisposable;
      this.subs.add(atom.commands.add('atom-workspace', {
        'editor-background:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subs.add(atom.config.observe('editor-background', (function(_this) {
        return function(conf) {
          return _this.applyBackground.apply(_this, [conf]);
        };
      })(this)));
      this.subs.add(atom.config.observe('editor-background.image.url', (function(_this) {
        return function(url) {
          return _this.blurImage.apply(_this, [url]);
        };
      })(this)));
      this.subs.add(atom.config.observe('editor-background.video.youTubeURL', (function(_this) {
        return function(url) {
          return _this.startYouTube.apply(_this, [url]);
        };
      })(this)));
      this.subs.add(atom.config.observe('editor-background.video.playAnimation', (function(_this) {
        return function(play) {
          if (play === false) {
            return _this.removeVideo();
          } else {
            return _this.startYouTube.apply(_this, []);
          }
        };
      })(this)));
      return this.initialize();
    },
    deactivate: function() {
      var _ref;
      if (this.subs != null) {
        this.subs.dispose();
      }
      if (((_ref = this.elements) != null ? _ref.main : void 0) != null) {
        return this.elements.main.remove();
      }
    },
    appendCss: function() {
      var css, cssstyle;
      css = "";
      cssstyle = document.createElement('style');
      cssstyle.type = 'text/css';
      cssstyle.setAttribute('id', '#editor-background-css');
      this.elements.main.appendChild(cssstyle);
      return this.elements.css = cssstyle;
    },
    createBox: function(depth) {
      var back, body, bottom, boxStyle, jest, left, right, top, wrapper;
      body = this.elements.body;
      jest = qr('body .eb-box-wrapper');
      if ((jest == null) || jest.length === 0) {
        left = document.createElement('div');
        top = document.createElement('div');
        right = document.createElement('div');
        bottom = document.createElement('div');
        back = document.createElement('div');
        wrapper = document.createElement('div');
        wrapper.appendChild(left);
        wrapper.appendChild(top);
        wrapper.appendChild(right);
        wrapper.appendChild(bottom);
        wrapper.appendChild(back);
        wrapper.setAttribute('class', 'eb-box-wrapper');
        left.setAttribute('class', 'eb-left');
        top.setAttribute('class', 'eb-top');
        right.setAttribute('class', 'eb-right');
        bottom.setAttribute('class', 'eb-bottom');
        back.setAttribute('class', 'eb-back');
        boxStyle = document.createElement('style');
        boxStyle.type = "text/css";
        this.elements.main.appendChild(boxStyle);
        this.elements.main.appendChild(wrapper);
      }
      return boxStyle;
    },
    mouseMove: function(ev) {
      var conf;
      conf = this.configWnd.get('editor-background');
      if (conf.box3d.mouseFactor > 0) {
        this.mouseX = ev.pageX;
        this.mouseY = ev.pageY;
        if (conf.box3d.depth > 0) {
          return this.updateBox();
        } else {
          return this.updateBgPos();
        }
      }
    },
    activateMouseMove: function() {
      var body;
      body = this.elements.body;
      return body.addEventListener('mousemove', (function(_this) {
        return function(ev) {
          return _this.mouseMove.apply(_this, [ev]);
        };
      })(this));
    },
    insertMain: function() {
      var el, main, _i, _len, _ref, _results;
      main = document.createElement('div');
      main.id = 'editor-background-main';
      this.elements.main = main;
      document.querySelector('#editor-background-main'.remove);
      this.elements.body.insertBefore(main, this.elements.body.firstChild);
      this.elements.itemViews = document.querySelectorAll('.item-views');
      _ref = this.elements.itemViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(el.style.cssText = "background:transparent !important");
      }
      return _results;
    },
    insertTextBackgroundCss: function() {
      var bgColor, txtBgCss;
      txtBgCss = document.createElement('style');
      txtBgCss.type = "text/css";
      bgColor = txtBgCss.cssText = ".editor-background-line{ background:black; color:white; } atom-pane-container atom-pane .item-views{ background:transparent !important; background-color:transparent !important; }";
      this.elements.textBackgroundCss = txtBgCss;
      return this.elements.main.appendChild(txtBgCss);
    },
    insertTextBackground: function() {
      var txtBg;
      txtBg = document.createElement('div');
      txtBg.style.cssText = "position:absolute; z-index:-1;";
      this.elements.textBackground = txtBg;
      return this.elements.main.appendChild(txtBg);
    },
    getYTId: function(url) {
      var ytid, ytidregres, ytreg;
      if (url !== '') {
        ytreg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/]{11})/i;
        ytidregres = ytreg.exec(url);
        if ((ytidregres != null ? ytidregres.length : void 0) > 0) {
          return ytid = ytidregres[1];
        }
      }
    },
    timer: {},
    frames: [],
    frame: 0,
    videoWidth: 0,
    videoHeight: 0,
    playing: true,
    getFrame: function(canvas, ctx, video, w, h) {
      var frame, tick;
      this.frame++;
      tick = 50;
      if (this.frame * tick >= this.time.end - this.time.start) {
        return this.getImagesDone;
      }
      frame = document.querySelector('#editor-background-frame');
      frame.innerText = this.frame;
      ctx.drawImage(video, 0, 0);
      video.pause();
      if (this.playing) {
        this.frames.push(canvas.toDataURL('image/jpeg'));
        video.play();
        if (this.playing) {
          return setTimeout((function(_this) {
            return function() {
              return _this.getFrame.apply(_this, [canvas, ctx, video, w, h]);
            };
          })(this), tick);
        }
      }
    },
    getImages: function() {
      var args, canvas, context, h, html, title, video, w, ytid;
      this.playing = true;
      this.frame = 0;
      video = this.elements.video;
      canvas = this.elements.videoCanvas;
      context = canvas.getContext("2d");
      ytid = this.getYTId(this.configWnd.get('editor-background.video.youTubeURL'));
      html = "<div id='editor-background-modal' style='overflow:hidden'> Getting Frame: <span id='editor-background-frame'>0</span><br> Please be patient.</div>";
      title = 'Editor background - frames';
      args = {
        buttons: {
          "Cancel": (function(_this) {
            return function(ev) {
              return _this.getImagesDone();
            };
          })(this)
        },
        title: title,
        content: html
      };
      this.popup.show(args);
      w = this.videoWidth;
      h = this.videoHeight;
      return this.getFrame(canvas, context, video, w, h);
    },
    getImagesDone: function() {
      var base64, error, frame, i, imagesFolder, ytid, _i, _len, _ref;
      this.playing = false;
      ytid = this.elements.ytid;
      imagesFolder = this.elements.videoPath + ytid + '_images/';
      try {
        fs.mkdirSync(imagesFolder, 0x1ff);
      } catch (_error) {
        error = _error;
      }
      i = 0;
      _ref = this.frames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        frame = _ref[_i];
        base64 = frame.replace(/^data:image\/jpeg;base64,/, "");
        try {
          fs.writeFileSync(imagesFolder + i + '.jpg', base64, 'base64');
        } catch (_error) {

        }
        i++;
      }
      this.elements.videoCanvas.remove();
      this.elements.video.remove();
      atom.config.set('editor-background.blurRadius', 0);
      atom.config.set('editor-background.imageURL', '');
      this.popup.hide();
      return this.initAnimation(ytid);
    },
    decodeVideo: function() {
      var video;
      this.frames = [];
      video = this.elements.video;
      video.addEventListener('ended', (function(_this) {
        return function() {
          return _this.getImagesDone();
        };
      })(this));
      return video.addEventListener('canplay', (function(_this) {
        return function() {
          return _this.getImages();
        };
      })(this));
    },
    insertVideo: function(savePath) {
      var conf, data, videoCanvas, videoHeight, videoOpacity, videoWidth;
      data = fs.readFileSync(savePath);
      videoCanvas = document.createElement('canvas');
      videoWidth = this.videoWidth;
      videoHeight = this.videoHeight;
      videoCanvas.width = videoWidth;
      videoCanvas.height = videoHeight;
      videoCanvas.id = "editor-background-videoCanvas";
      conf = this.configWnd.get('editor-background');
      videoOpacity = (conf.video.opacity / 100).toFixed(2);
      videoCanvas.style.cssText = "position:absolute; top:0px; left:0px; display:none; width:" + videoWidth + "px; height:" + videoHeight + "px; opacity:" + videoOpacity + ";";
      this.elements.videoCanvas = videoCanvas;
      this.elements.main.insertBefore(videoCanvas, this.elements.textBackground);
      return this.decodeVideo();
    },
    createVideoElement: function(src) {
      var source, video;
      video = document.createElement('video');
      source = document.createElement('source');
      this.elements.video = video;
      this.elements.source = source;
      video.appendChild(source);
      source.type = "video/" + this.elements.videoFormat;
      source.src = src;
      video.style.cssText = "position:absolute; left:0; top:0; width:100%; height:100%;";
      return this.elements.main.insertBefore(video, this.elements.textBackground);
    },
    chooseFormat: function(formats, next) {
      var args, format, formatKeys, html, itag, _i, _len;
      console.log('choose format?');
      html = '<div style="font-size:1.1em;text-align:center;margin-bottom:20px;"> Choose video format</div> <div style="text-align:center;margin-bottom:30px;"> <select id="background-format" name="format">';
      formatKeys = Object.keys(formats);
      for (_i = 0, _len = formatKeys.length; _i < _len; _i++) {
        itag = formatKeys[_i];
        format = formats[itag];
        html += "<option value=\"" + format.itag + "\">Size: " + format.size + "</option>";
      }
      html += '</select></div> </div> <br><br> </div>';
      args = {
        buttons: {
          "OK": (function(_this) {
            return function(ev, popup) {
              var bgf;
              bgf = document.querySelector('#background-format');
              itag = bgf.value;
              _this.popup.hide();
              return next(itag);
            };
          })(this)
        },
        content: html,
        title: "Editor Background - Video format"
      };
      return this.popup.show(args);
    },
    downloadYTVideo: function(url) {
      var alreadyExists, dirExists, downloaded, e, error, savePath, videoExt, videoFormat, ytid;
      videoExt = this.elements.videoExt;
      videoFormat = this.elements.videoFormat;
      if (url !== '') {
        ytid = this.getYTId(url);
        this.elements.ytid = ytid;
        savePath = this.elements.videoPath + ytid + videoExt;
        alreadyExists = false;
        try {
          downloaded = fs.statSync(savePath);
          alreadyExists = downloaded.isFile();
        } catch (_error) {
          error = _error;
        }
        try {
          dirExists = fs.statSync(this.elements.videoPath);
          if (dirExists != null) {
            if (!dirExists.isDirectory()) {
              fs.mkdirSync(this.elements.videoPath, 0x1ff);
            }
          } else {
            fs.mkdirSync(this.elements.videoPath, 0x1ff);
          }
        } catch (_error) {
          e = _error;
        }
        if (!alreadyExists) {
          this.yt = new yt(url);
          this.yt.on('formats', (function(_this) {
            return function(formats) {};
          })(this));
          this.yt.on('data', (function(_this) {
            return function(data) {
              var args, html, title;
              html = '<div style="text-align:center;font-size:1.1em;"> Downloading: ' + data.percent.toFixed(2) + ' % </div>';
              title = 'Editor Background - download';
              args = {
                title: "Editor Background - downloading...",
                content: html
              };
              return _this.popup.show(args);
            };
          })(this));
          this.yt.on('done', (function(_this) {
            return function(chunks) {
              _this.popup.hide();
              _this.createVideoElement(savePath);
              return _this.insertVideo.apply(_this, [savePath]);
            };
          })(this));
          this.yt.on('ready', (function(_this) {
            return function() {
              var conf;
              console.log('get video info ready');
              conf = _this.configWnd.get('editor-background');
              _this.time = {
                start: conf.video.startTime,
                end: conf.video.endTime
              };
              return _this.chooseFormat(_this.yt.formats, function(format) {
                console.log('we chosen format', format);
                _this.videoWidth = _this.yt.formats[format].width;
                _this.videoHeight = _this.yt.formats[format].height;
                return _this.yt.download({
                  filename: savePath,
                  itag: format,
                  time: _this.time
                });
              });
            };
          })(this));
          console.log('getting video info');
          return this.yt.getVideoInfo();
        } else {
          return this.initAnimation(ytid);
        }
      } else {
        return this.removeVideo();
      }
    },
    removeVideo: function() {
      if (this.animation != null) {
        this.animation.stop();
        return delete this.animation;
      }
    },
    startYouTube: function() {
      var conf;
      if (this.packagesLoaded) {
        this.removeVideo();
        conf = this.configWnd.get('editor-background');
        if ((conf.video.youTubeURL != null) !== '' && conf.video.playAnimation) {
          if (this.animation == null) {
            return this.downloadYTVideo(conf.video.youTubeURL);
          }
        } else {
          return this.removeVideo();
        }
      } else {
        return setTimeout(((function(_this) {
          return function() {
            return _this.startYouTube.apply(_this, []);
          };
        })(this)), 1000);
      }
    },
    initAnimation: function(ytid) {
      var conf, videoOpacity, _ref;
      if (this.animation == null) {
        atom.notifications.add('notice', 'starting animation...');
        this.animation = new animation(ytid);
        this.animation.start(this.elements.main, this.elements.textBackground);
        conf = this.configWnd.get('editor-background');
        videoOpacity = (conf.video.opacity / 100).toFixed(2);
        if (((_ref = this.animation) != null ? _ref.canvas : void 0) != null) {
          return inline(this.animation.canvas, "opacity:" + videoOpacity + ";");
        }
      }
    },
    getOffset: function(element, offset) {
      ({
        left: 0,
        top: 0
      });
      if (element != null) {
        if (offset == null) {
          offset = {
            left: 0,
            top: 0
          };
        }
        offset.left += element.offsetLeft;
        offset.top += element.offsetTop;
        if (element.offsetParent != null) {
          return this.getOffset(element.offsetParent, offset);
        } else {
          return offset;
        }
      }
    },
    drawLine: function(tokenizedLine, attrs) {
      var line, marginLeft, text;
      line = document.createElement('div');
      line.className = 'editor-background-line';
      text = tokenizedLine.text.trim();
      text = escapeHTML(text);
      text = text.replace(/[\s]{1}/gi, '<span class="editor-background-white"></span>');
      text = text.replace(/[\t]{1}/gi, '<span class="editor-background-tab"></span>');
      line.innerHTML = text;
      marginLeft = tokenizedLine.indentLevel * tokenizedLine.tabLength * attrs.charWidth;
      marginLeft -= attrs.scrollLeft;
      line.style.cssText = "margin-left:" + marginLeft + "px;";
      return this.elements.textBackground.appendChild(line);
    },
    drawLines: function(attrs) {
      var activeEditor, attrsForward, bottom, charWidth, color, computedStyle, conf, css, displayBuffer, editor, editorSetting, expand, fontFamily, fontSize, left, line, lineHeight, offset, opacity, right, root, scaleX, scaleY, scrollView, tabWidth, textBlur, top, _i, _len, _ref, _results;
      if (attrs != null) {
        if ((attrs.editorElement != null) && (attrs.screenLines != null)) {
          this.elements.textBackground.innerText = '';
          editor = attrs.editorElement;
          if (editor.constructor.name === 'atom-text-editor') {
            conf = this.configWnd.get('editor-background');
            textBlur = conf.text.blur;
            opacity = (conf.text.opacity / 100).toFixed(2);
            color = conf.text.color.toHexString();
            expand = conf.text.expand;
            root = editor.shadowRoot;
            scrollView = root.querySelector('.scroll-view');
            if (scrollView != null) {
              offset = this.getOffset(scrollView);
              top = offset.top - attrs.offsetTop;
              left = offset.left;
              right = left + scrollView.width + textBlur;
              bottom = top + scrollView.height;
              activeEditor = attrs.activeEditor;
              displayBuffer = attrs.displayBuffer;
              lineHeight = attrs.lineHeight;
              charWidth = displayBuffer.getDefaultCharWidth();
              tabWidth = displayBuffer.getTabLength() * charWidth;
            }
            editor = atom.workspace.getActiveTextEditor();
            editor = atom.views.getView(editor);
            if (editor != null) {
              computedStyle = window.getComputedStyle(editor);
              fontFamily = computedStyle.fontFamily;
              fontSize = computedStyle.fontSize;
              if (atom.config.settings.editor != null) {
                editorSetting = atom.config.settings.editor;
                if (editorSetting.fontFamily != null) {
                  fontFamily = editorSetting.fontFamily;
                }
                if (editorSetting.fontSize != null) {
                  fontSize = editorSetting.fontSize;
                }
              }
              if (!/[0-9]+px$/.test(fontSize)) {
                fontSize += 'px';
              }
              scaleX = 1 + parseFloat((expand / 100).toFixed(2));
              scaleY = 1 + parseFloat((expand / 10).toFixed(2));
              css = this.elements.textBackgroundCss;
              css.innerText = ".editor-background-line{ font-family:" + fontFamily + "; font-size:" + fontSize + "; height:" + lineHeight + "px; display:block; color:transparent; background:" + color + "; width:auto; border-radius:10px; transform:translate3d(0,0,0) scale(" + scaleX + "," + scaleY + "); float:left; clear:both; } .editor-background-white{ width:" + charWidth + "px; display:inline-block; } .editor-background-tab{ width:" + tabWidth + "px; display:inline-block; }";
              this.elements.textBackground.style.cssText = "top:" + top + "px; left:" + left + "px; right:" + right + "px; bottom:" + bottom + "px; position:absolute; overflow:hidden; z-index:0; pointer-events:none; opacity:" + opacity + "; transform:translate3d(0,0,0); -webkit-filter:blur(" + textBlur + "px);";
              attrsForward = {
                charWidth: charWidth,
                scrollLeft: attrs.scrollLeft
              };
              _ref = attrs.screenLines;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                line = _ref[_i];
                _results.push(this.drawLine(line, attrsForward));
              }
              return _results;
            }
          }
        }
      }
    },
    activeEditor: {},
    removeBgLines: function() {
      return this.elements.textBackground.innerText = '';
    },
    drawBackground: function(event, editor) {
      var activeEditor, actualLines, attrs, displayBuffer, editorElement, editorRect, lineHeight, offsetTop, screenLines, scrollLeft, scrollTop, tokenizedLines;
      if ((event != null ? event.destroy : void 0) != null) {
        if (event.destroy.pane.items.length === 0) {
          this.removeBgLines();
          return;
        }
      }
      if ((event != null ? event.active : void 0) != null) {
        this.activeEditor = editor;
        if (editor != null) {
          process.nextTick((function(_this) {
            return function() {
              return _this.drawBackground.apply(_this, []);
            };
          })(this));
        } else {
          this.removeBgLines();
        }
        return;
      }
      this.activeEditor = atom.workspace.getActiveTextEditor();
      activeEditor = this.activeEditor;
      if ((activeEditor != null ? activeEditor.displayBuffer : void 0) == null) {
        this.removeBgLines();
      }
      if ((activeEditor != null ? activeEditor.displayBuffer : void 0) != null) {
        displayBuffer = activeEditor.displayBuffer;
        if (displayBuffer != null) {
          editorElement = atom.views.getView(activeEditor);
          actualLines = activeEditor.getVisibleRowRange();
          tokenizedLines = displayBuffer.getTokenizedLines();
          if ((actualLines != null ? actualLines.length : void 0) === 2) {
            if ((actualLines != null) && (actualLines[0] != null) && (actualLines[1] != null)) {
              screenLines = tokenizedLines.slice(actualLines[0], +actualLines[1] + 1 || 9e9);
              scrollTop = activeEditor.getScrollTop();
              scrollLeft = activeEditor.getScrollLeft();
              lineHeight = activeEditor.getLineHeightInPixels();
              offsetTop = scrollTop - Math.floor(scrollTop / lineHeight) * lineHeight;
              editorElement = atom.views.getView(activeEditor);
              if (editorElement != null) {
                if (editorElement.constructor.name === 'atom-text-editor') {
                  editorRect = editorElement.getBoundingClientRect();
                  attrs = {
                    editorElement: editorElement,
                    activeEditor: activeEditor,
                    lineHeight: lineHeight,
                    displayBuffer: displayBuffer,
                    screenLines: screenLines,
                    offsetTop: offsetTop,
                    scrollTop: scrollTop,
                    scrollLeft: scrollLeft,
                    visibleBuffer: actualLines
                  };
                  return this.drawLines(attrs);
                }
              }
            }
          }
        }
      }
    },
    watchEditor: function(editor) {
      this.subs.add(editor.onDidChangeScrollTop((function(_this) {
        return function(scroll) {
          return _this.drawBackground.apply(_this, [
            {
              scrollTop: scroll
            }, editor
          ]);
        };
      })(this)));
      this.subs.add(editor.onDidChangeScrollLeft((function(_this) {
        return function(scroll) {
          return _this.drawBackground.apply(_this, [
            {
              scrolLeft: scroll
            }, editor
          ]);
        };
      })(this)));
      return this.subs.add(editor.onDidChange((function(_this) {
        return function(change) {
          return _this.drawBackground.apply(_this, [
            {
              change: change
            }, editor
          ]);
        };
      })(this)));
    },
    watchEditors: function() {
      this.subs.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.watchEditor.apply(_this, [editor]);
        };
      })(this)));
      this.subs.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function(editor) {
          return _this.drawBackground.apply(_this, [
            {
              active: editor
            }, editor
          ]);
        };
      })(this)));
      return this.subs.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(pane) {
          return _this.drawBackground.apply(_this, [
            {
              destroy: pane
            }
          ]);
        };
      })(this)));
    },
    initialize: function() {
      var activeEditor, conf, confOptions, error, k, keys, loaded, videoOpacity, _ref;
      this.elements.body = qr('body');
      this.elements.workspace = qr('atom-workspace');
      this.elements.editor = null;
      if (this.elements.workspace != null) {
        activeEditor = atom.workspace.getActiveTextEditor();
        this.elements.editor = atom.views.getView(activeEditor);
      }
      this.elements.treeView = qr('.tree-view');
      this.elements.left = qr('.left');
      this.elements.leftPanel = qr('.panel-left');
      this.elements.resizer = qr('.tree-view-resizer');
      this.elements.tabBar = qr('.tab-bar');
      this.elements.insetPanel = qr('.inset-panel');
      keys = Object.keys(this.elements);
      loaded = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          k = keys[_i];
          if (this.elements[k] != null) {
            _results.push(this.elements[k]);
          }
        }
        return _results;
      }).call(this);
      if (loaded.length === keys.length) {
        this.insertMain();
        this.popup = new popup();
        confOptions = {
          onChange: (function(_this) {
            return function() {
              return _this.drawBackground();
            };
          })(this)
        };
        this.configWnd = new configWindow('editor-background', confOptions);
        this.activateMouseMove();
        conf = this.configWnd.get('editor-background');
        this.elements.image = document.createElement('img');
        this.elements.image.id = 'editor-background-image';
        this.elements.image.setAttribute('src', conf.image.url);
        this.elements.blurredImage = conf.image.url;
        this.insertTextBackgroundCss();
        if (conf.box3d.mouseFactor > 0) {
          this.activateMouseMove();
        }
        this.appendCss();
        this.watchEditors();
        this.elements.bg = document.createElement('div');
        this.elements.bg.style.cssText = "position:absolute;width:100%;height:100%;";
        this.elements.main.appendChild(this.elements.bg);
        this.elements.boxStyle = this.createBox();
        this.elements.plane = document.createElement('div');
        this.elements.plane.style.cssText = planeInitialCss;
        this.elements.main.appendChild(this.elements.plane);
        this.insertTextBackground();
        this.colors.workspaceBgColor = style(this.elements.editor).backgroundColor;
        this.colors.treeOriginalRGB = style(this.elements.treeView).backgroundColor;
        this.packagesLoaded = true;
        videoOpacity = (conf.video.opacity / 100).toFixed(2);
        if (((_ref = this.animation) != null ? _ref.canvas : void 0) != null) {
          inline(this.animation.canvas, "opacity:" + videoOpacity + ";");
        }
        this.blurImage();
        this.elements.videoPath = this.pluginPath() + '/youtube-videos/';
        this.elements.libPath = this.pluginPath() + '/lib/';
        this.elements.videoExt = '.mp4';
        this.elements.videoFormat = 'mp4';
        try {
          fs.mkdirSync(this.elements.videoPath, 0x1ff);
        } catch (_error) {
          error = _error;
        }
        return this.applyBackground.apply(this);
      } else {
        return setTimeout(((function(_this) {
          return function() {
            return _this.initialize.apply(_this);
          };
        })(this)), 1000);
      }
    },
    updateBgPos: function() {
      var body, conf, factor, offsetX, offsetY, polowaX, polowaY, x, y;
      conf = this.configWnd.get('editor-background');
      body = this.elements.body;
      factor = conf.box3d.mouseFactor;
      polowaX = Math.floor(body.clientWidth / 2);
      polowaY = Math.floor(body.clientHeight / 2);
      offsetX = this.mouseX - polowaX;
      offsetY = this.mouseY - polowaY;
      x = Math.floor(offsetX / factor);
      y = Math.floor(offsetY / factor);
      return inline(this.elements.bg, "background-position:" + x + "px " + y + "px !important;");
    },
    updateBox: function(depth) {
      var background, bgSize, body, boxCss, conf, depth2, factor, imgOpacity, offsetX, offsetY, opacity, polowaX, polowaY, position, range, range2, repeat, x, y;
      conf = this.configWnd.get('editor-background');
      if (depth == null) {
        depth = conf.box3d.depth;
      }
      depth2 = Math.floor(depth / 2);
      background = this.elements.blurredImage;
      opacity = (conf.box3d.shadowOpacity / 100).toFixed(2);
      imgOpacity = conf.image.opacity / 100;
      range = 300;
      range2 = Math.floor(range / 3);
      bgSize = conf.image.backgroundSize;
      if (bgSize === 'manual') {
        bgSize = conf.image.manualBackgroundSize;
      }
      if (bgSize === 'original') {
        bgSize = 'auto';
      }
      body = this.elements.body;
      factor = conf.box3d.mouseFactor;
      polowaX = Math.floor(body.clientWidth / 2);
      polowaY = Math.floor(body.clientHeight / 2);
      offsetX = this.mouseX - polowaX;
      offsetY = this.mouseY - polowaY;
      x = polowaX + (Math.floor(offsetX / factor));
      y = polowaY + (Math.floor(offsetY / factor));
      inline(this.elements.bg, "opacity:0;");
      position = conf.image.backgroundPosition;
      repeat = conf.image.repeat;
      boxCss = ".eb-box-wrapper{ perspective:1000px; perspective-origin:" + x + "px " + y + "px; backface-visibility: hidden; position:fixed; top:0; left:0; width:100%; height:100%; opacity:" + imgOpacity + "; } .eb-left,.eb-top,.eb-right,.eb-bottom,.eb-back{ position:fixed; transform-origin:50% 50%; box-shadow:inset 0px 0px " + range + "px rgba(0,0,0," + opacity + "), inset 0px 0px " + range2 + "px rgba(0,0,0," + opacity + "); background-image:url('" + background + "'); background-size:" + bgSize + "; backface-visibility: hidden; background-position:" + position + "; background-repeat:" + repeat + "; } .eb-left,.eb-right{ width:" + depth + "px; height:100%; } .eb-top,.eb-bottom{ width:100%; height:" + depth + "px; } .eb-left{ transform: translate3d(-50%,0,0) rotateY(-90deg); left:0; } .eb-top{ transform: translate3d(0,-50%,0) rotateX(90deg); top:0; } .eb-right{ transform: translate3d(50%,0,0) rotateY(-90deg); right:0; } .eb-bottom{ transform: translate3d(0,50%,0) rotateX(90deg); bottom:0; } .eb-back{ transform: translate3d(0,0,-" + depth2 + "px); width:100%; height:100%; }";
      this.elements.boxStyle.innerText = boxCss;
      if (depth === 0) {
        return this.elements.boxStyle.innerText = ".eb-box-wrapper{display:none;}";
      }
    },
    pluginPath: function() {
      var _path;
      _path = atom.packages.resolvePackagePath('editor-background');
      if (!_path) {
        _path = path.resolve(__dirname);
      }
      return _path;
    },
    blurImage: function() {
      var applyBlur, base64Data, conf, filename, imageData, opacity, position, repeat;
      if (this.packagesLoaded) {
        conf = this.configWnd.get('editor-background');
        this.elements.image.setAttribute('src', conf.image.url);
        applyBlur = false;
        if (conf.image.blurRadius > 0) {
          if (this.elements.image != null) {
            if (this.elements.image.complete) {
              applyBlur = true;
            } else {
              setTimeout(((function(_this) {
                return function() {
                  return _this.blurImage.apply(_this);
                };
              })(this)), 1000);
            }
          }
        }
        if (applyBlur && conf.image.url) {
          imageData = blur.stackBlurImage(this.elements.image, conf.image.blurRadius, false);
          base64Data = imageData.replace(/^data:image\/png;base64,/, "");
          filename = this.pluginPath() + "/blur.png";
          filename = filename.replace(/\\/gi, '/');
          fs.writeFileSync(filename, base64Data, {
            mode: 0x1ff,
            encoding: 'base64'
          });
          imageData = filename + "?timestamp=" + Date.now();
        } else {
          imageData = conf.image.url;
        }
        this.elements.blurredImage = imageData;
        if (conf.box3d.depth > 0) {
          return this.updateBox();
        } else {
          opacity = conf.image.opacity / 100;
          position = conf.image.backgroundPosition;
          repeat = conf.image.repeat;
          inline(this.elements.bg, "background-image: url('" + imageData + "') !important;");
          inline(this.elements.bg, "opacity:" + opacity + ";");
          inline(this.elements.bg, "background-position:" + position + ";");
          return inline(this.elements.bg, "background-repeat:" + repeat + ";");
        }
      }
    },
    applyBackground: function() {
      var alpha, conf, newColor, newTreeRGBA, opacity, rgb, treeAlpha, treeOpacity, treeRGB, workspaceView, _newColor;
      if (this.packagesLoaded) {
        workspaceView = this.elements.workspace;
        if (workspaceView != null) {
          if (workspaceView.className.indexOf('editor-background') === -1) {
            workspaceView.className += ' editor-background';
          }
        }
        conf = this.configWnd.get('editor-background');
        opacity = 100 - conf.image.opacity;
        alpha = (opacity / 100).toFixed(2);
        rgb = colorToArray(this.colors.workspaceBgColor);
        newColor = 'rgba( ' + rgb[0] + ' , ' + rgb[1] + ' , ' + rgb[2] + ' , ' + alpha + ')';
        treeOpacity = conf.other.treeViewOpacity;
        treeAlpha = (treeOpacity / 100).toFixed(2);
        treeRGB = colorToArray(this.colors.treeOriginalRGB);
        newTreeRGBA = 'rgba(' + treeRGB[0] + ',' + treeRGB[1] + ',' + treeRGB[2] + ',' + treeAlpha + ')';
        if (conf.image.customOverlayColor) {
          _newColor = conf.image.overlayColor.toRGBAString();
          rgb = colorToArray(_newColor);
          newColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
          newTreeRGBA = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + treeAlpha + ')';
        } else {
          _newColor = this.colors.workspaceBgColor;
        }
        this.elements.css.innerText += "body{background:" + _newColor + " !important;}";
        if (conf.text.shadow) {
          this.elements.css.innerText += "\natom-text-editor::shadow .line{text-shadow:" + conf.text.shadow + " !important;}";
        }
        if (conf.box3d.depth > 0) {
          this.updateBox(conf.box3d.depth);
        } else {
          this.elements.boxStyle.innerText = ".eb-box-wrapper{display:none;}";
        }
        if (conf.image.backgroundSize !== 'original') {
          inline(this.elements.bg, 'background-size:' + conf.image.backgroundSize + ' !important;');
        } else {
          inline(this.elements.bg, 'background-size:auto !important');
        }
        if (conf.image.backgroundSize === 'manual') {
          inline(this.elements.bg, 'background-size:' + conf.image.manualBackgroundSize + ' !important;');
        }
        if (conf.image.style) {
          this.elements.plane.style.cssText += conf.image.style;
        }
        this.blurImage();
        if (conf.other.transparentTabBar) {
          inline(this.elements.tabBar, 'background:rgba(0,0,0,0) !important;');
          inline(this.elements.insetPanel, 'background:rgba(0,0,0,0) !important;');
        }
        if (conf.other.treeViewOpacity > 0) {
          inline(this.elements.treeView, 'background:' + newTreeRGBA + ' !important;');
          inline(this.elements.left, 'background:transparent !important;');
          inline(this.elements.resizer, 'background:transparent !important;');
          return inline(this.elements.leftPanel, 'background:transparent !important;');
        }
      }
    },
    toggle: function() {
      if (!this.configWnd) {
        return atom.notifications.add('warning', 'Editor-background is only available after you open some files.');
      } else {
        if (!this.configWnd.visible) {
          return this.configWnd.show();
        } else {
          return this.popup.hide();
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZWRpdG9yLWJhY2tncm91bmQvbGliL2VkaXRvci1iYWNrZ3JvdW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1TUFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsZ0JBQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsV0FBUixDQUpMLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FMUixDQUFBOztBQUFBLEVBTUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxVQUFSLENBTmYsQ0FBQTs7QUFBQSxFQU9BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVBQLENBQUE7O0FBQUEsRUFTQSxFQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7V0FBYyxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixFQUFkO0VBQUEsQ0FUTCxDQUFBOztBQUFBLEVBVUEsS0FBQSxHQUFRLFNBQUMsT0FBRCxHQUFBO1dBQWEsUUFBUSxDQUFDLFdBQVcsQ0FBQyxnQkFBckIsQ0FBc0MsT0FBdEMsRUFBYjtFQUFBLENBVlIsQ0FBQTs7QUFBQSxFQVdBLE1BQUEsR0FBUyxTQUFDLE9BQUQsRUFBUyxLQUFULEdBQUE7V0FBbUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFkLElBQXlCLE1BQTVDO0VBQUEsQ0FYVCxDQUFBOztBQUFBLEVBWUEsVUFBQSxHQUFh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

//# sourceURL=/C:/Users/soviet/.atom/packages/editor-background/lib/editor-background.coffee

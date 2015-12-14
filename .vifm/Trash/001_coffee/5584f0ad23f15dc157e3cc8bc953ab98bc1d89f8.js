(function() {
  var $, Popup, SimpleSlider, colorpicker, fs;

  fs = require('fs');

  $ = require('atom-space-pen-views').$;

  SimpleSlider = require('./simpleSlider');

  colorpicker = require('./colorpicker.js');

  Popup = (function() {
    var buttons, content, controls, element, fadeTime, onHide, title, visible;

    element = null;

    content = null;

    fadeTime = 250;

    visible = false;

    onHide = null;

    controls = {};

    title = null;

    buttons = null;

    function Popup(appendElement) {
      var close, html;
      if (appendElement == null) {
        appendElement = document.querySelector('body');
      }
      html = '<div class="wrapper"> <div class="close">X</div> <div class="title"></div> <form name="contentForm" class="content"> </form> <span class="loading loading-spinner-tiny inline-block" id="working" style="display:none;"></span> <div class="buttons"></div> </div>';
      this.element = document.createElement('div');
      this.element.className = 'eb-modal-window';
      this.element.innerHTML = html;
      this.content = this.element.querySelector('.content');
      this.form = this.content;
      fadeTime = this.fadeTime;
      this.element.style.transition = "opacity " + fadeTime + "ms";
      this.element.style.webkitTransition = "opacity " + fadeTime + "ms";
      close = this.element.querySelector('.close');
      close.addEventListener('click', (function(_this) {
        return function(ev) {
          return _this.hide();
        };
      })(this));
      this.title = this.element.querySelector('.title');
      this.buttons = this.element.querySelector('.buttons');
      appendElement.appendChild(this.element);
      this.element.addEventListener('keydown', function(ev) {
        return ev.stopPropagation();
      });
      this;
    }

    Popup.prototype.destroy = function() {
      return this.element.remove();
    };

    Popup.prototype.center = function() {
      var h, h2, h_, hh, w, w2, w_, ww;
      w_ = window.getComputedStyle(this.element).width;
      h_ = window.getComputedStyle(this.element).height;
      ww = /([0-9]+)/gi.exec(w_);
      hh = /([0-9]+)/gi.exec(h_);
      if ((ww != null) && (hh != null)) {
        w = ww[1];
        h = hh[1];
        w2 = Math.floor(w / 2);
        h2 = Math.floor(h / 2);
        this.element.style.left = "calc(50% - " + w2 + "px)";
        return this.element.style.top = "calc(50% - " + h2 + "px)";
      }
    };

    Popup.prototype.getControls = function() {
      var form, _i, _len, _ref, _results;
      this.controls = {};
      this.controls.forms = document.forms;
      _ref = document.forms;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        form = _ref[_i];
        _results.push((function(_this) {
          return function(form) {
            var el, _j, _len1, _ref1, _results1;
            _ref1 = form.elements;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              el = _ref1[_j];
              _results1.push((function(el) {
                return _this.controls[el.name] = el;
              })(el));
            }
            return _results1;
          };
        })(this)(form));
      }
      return _results;
    };

    Popup.prototype.makeSliders = function() {
      var range, ranges, _i, _len, _results;
      ranges = this.element.querySelectorAll('.range');
      _results = [];
      for (_i = 0, _len = ranges.length; _i < _len; _i++) {
        range = ranges[_i];
        _results.push((function(range) {
          var dataRange, input, val;
          $(range).bind('change', function(ev) {
            var val;
            val = range.value;
            return $(range).simpleSlider('setValue', val);
          });
          input = document.createElement('input');
          input.type = 'text';
          input.style.minWidth = '40px';
          range.parentElement.insertBefore(input, range);
          input.addEventListener('change', function() {
            return range.value = input.value;
          });
          val = range.value || 0;
          input.value = val;
          dataRange = range.dataset.sliderRange.split(',');
          $(range).simpleSlider({
            range: dataRange,
            value: val
          });
          return $(range).bind('sliderchanged', function(ev, data) {
            return input.value = data.value;
          });
        })(range));
      }
      return _results;
    };

    Popup.prototype.makeColors = function() {
      var colorPickers, picker, _i, _len, _results;
      colorPickers = this.element.querySelectorAll('.color-picker');
      _results = [];
      for (_i = 0, _len = colorPickers.length; _i < _len; _i++) {
        picker = colorPickers[_i];
        _results.push((function(picker) {
          var cpicker, wrapper;
          $(picker).wrap('<div class="picker-wrapper"></div>');
          wrapper = $(picker).parent();
          cpicker = new colorpicker(picker, {
            container: wrapper,
            format: 'hex'
          });
          return $(cpicker).focus(function() {
            return $(cpicker).colorpicker('show');
          });
        })(picker));
      }
      return _results;
    };

    Popup.prototype.setVisible = function() {
      var cmpSt, modal, otherModals, zIndex, _i, _len;
      otherModals = document.querySelectorAll('.eb-modal-window');
      zIndex = 1;
      for (_i = 0, _len = otherModals.length; _i < _len; _i++) {
        modal = otherModals[_i];
        cmpSt = window.getComputedStyle(modal);
        if (cmpSt.zIndex > zIndex) {
          zIndex = cmpSt.zIndex;
        }
      }
      this.element.style.display = 'block';
      this.element.style.opacity = 1;
      this.element.style.zIndex = zIndex + 1;
      this.visible = true;
      this.center();
      this.getControls();
      if (!this.inputParsed) {
        this.makeSliders();
        this.makeColors();
        return this.inputParsed = true;
      }
    };

    Popup.prototype.show = function(attrs) {
      var action, buttonsEl, contentEl, contentHTML, name, titleEl, titleHTML, _fn, _ref;
      if (attrs == null) {
        return this.setVisible();
      }
      this.inputParsed = false;
      titleHTML = attrs.title;
      contentHTML = attrs.content;
      titleEl = this.element.querySelector('.title');
      contentEl = this.element.querySelector('.content');
      this.content = contentEl;
      buttonsEl = this.element.querySelector('.buttons');
      this.buttons = buttonsEl;
      buttonsEl.innerHTML = "";
      titleEl.innerHTML = titleHTML;
      contentEl.innerHTML = contentHTML;
      if (attrs.onHide != null) {
        this.onHide = attrs.onHide;
      } else {
        this.onHide = null;
      }
      if ((attrs != null ? attrs.buttons : void 0) != null) {
        _ref = attrs.buttons;
        _fn = (function(_this) {
          return function(name, action) {
            var btn;
            btn = null;
            btn = document.createElement('button');
            btn.className = 'btn btn-default';
            btn.innerText = name;
            btn.addEventListener('click', function(ev) {
              return action(ev, _this);
            });
            return buttonsEl.appendChild(btn);
          };
        })(this);
        for (name in _ref) {
          action = _ref[name];
          _fn(name, action);
        }
      }
      this.setVisible();
      if ((attrs != null ? attrs.onShow : void 0) != null) {
        return attrs.onShow(this);
      }
    };

    Popup.prototype.hide = function(next) {
      this.element.style.opacity = 0;
      this.visible = false;
      return setTimeout((function(_this) {
        return function() {
          _this.element.style.display = 'none';
          if (_this.onHide != null) {
            _this.onHide(_this);
          }
          if (next != null) {
            return next();
          }
        };
      })(this), this.fadeTime);
    };

    Popup.prototype.close = function() {
      return this.hide((function(_this) {
        return function() {
          return _this.content.innerHTML = '';
        };
      })(this));
    };

    Popup.prototype.destroy = function() {
      return this.hide((function(_this) {
        return function() {
          _this.element.remove();
          return delete _this;
        };
      })(this));
    };

    Popup.prototype.working = function(value) {
      var icon;
      icon = this.element.querySelector('#working');
      if (value) {
        return icon.style.display = 'block';
      } else {
        return icon.style.display = 'none';
      }
    };

    return Popup;

  })();

  module.exports = Popup;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZWRpdG9yLWJhY2tncm91bmQvbGliL3BvcHVwLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBREQsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsZ0JBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxrQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLTTtBQUVKLFFBQUEscUVBQUE7O0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBOztBQUFBLElBQ0EsT0FBQSxHQUFVLElBRFYsQ0FBQTs7QUFBQSxJQUVBLFFBQUEsR0FBVSxHQUZWLENBQUE7O0FBQUEsSUFHQSxPQUFBLEdBQVUsS0FIVixDQUFBOztBQUFBLElBSUEsTUFBQSxHQUFTLElBSlQsQ0FBQTs7QUFBQSxJQUtBLFFBQUEsR0FBVyxFQUxYLENBQUE7O0FBQUEsSUFNQSxLQUFBLEdBQVEsSUFOUixDQUFBOztBQUFBLElBT0EsT0FBQSxHQUFVLElBUFYsQ0FBQTs7QUFTWSxJQUFBLGVBQUMsYUFBRCxHQUFBO0FBQ1YsVUFBQSxXQUFBO0FBQUEsTUFBQSxJQUFPLHFCQUFQO0FBQ0UsUUFBQSxhQUFBLEdBQWdCLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBQWhCLENBREY7T0FBQTtBQUFBLE1BR0EsSUFBQSxHQUFPLG9RQUhQLENBQUE7QUFBQSxNQWFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FiWCxDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUIsaUJBZHJCLENBQUE7QUFBQSxNQWVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQixJQWZyQixDQUFBO0FBQUEsTUFnQkEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FoQlgsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLE9BakJULENBQUE7QUFBQSxNQWtCQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBbEJaLENBQUE7QUFBQSxNQW1CQSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFmLEdBQTZCLFVBQUEsR0FBVSxRQUFWLEdBQW1CLElBbkJoRCxDQUFBO0FBQUEsTUFvQkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWYsR0FBbUMsVUFBQSxHQUFVLFFBQVYsR0FBbUIsSUFwQnRELENBQUE7QUFBQSxNQXFCQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBckJSLENBQUE7QUFBQSxNQXNCQSxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsRUFBRCxHQUFBO2lCQUM3QixLQUFDLENBQUEsSUFBRCxDQUFBLEVBRDZCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0IsQ0F0QkEsQ0FBQTtBQUFBLE1Bd0JBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBeEJULENBQUE7QUFBQSxNQXlCQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUF1QixVQUF2QixDQXpCWCxDQUFBO0FBQUEsTUE0QkEsYUFBYSxDQUFDLFdBQWQsQ0FBMEIsSUFBQyxDQUFBLE9BQTNCLENBNUJBLENBQUE7QUFBQSxNQTZCQSxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULENBQTBCLFNBQTFCLEVBQW9DLFNBQUMsRUFBRCxHQUFBO2VBQ2xDLEVBQUUsQ0FBQyxlQUFILENBQUEsRUFEa0M7TUFBQSxDQUFwQyxDQTdCQSxDQUFBO0FBQUEsTUErQkEsSUEvQkEsQ0FEVTtJQUFBLENBVFo7O0FBQUEsb0JBMkNBLE9BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQSxFQURNO0lBQUEsQ0EzQ1IsQ0FBQTs7QUFBQSxvQkE4Q0EsTUFBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLFVBQUEsNEJBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsSUFBQyxDQUFBLE9BQXpCLENBQWlDLENBQUMsS0FBdkMsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxHQUFLLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixJQUFDLENBQUEsT0FBekIsQ0FBaUMsQ0FBQyxNQUR2QyxDQUFBO0FBQUEsTUFFQSxFQUFBLEdBQUssWUFBWSxDQUFDLElBQWIsQ0FBa0IsRUFBbEIsQ0FGTCxDQUFBO0FBQUEsTUFHQSxFQUFBLEdBQUssWUFBWSxDQUFDLElBQWIsQ0FBa0IsRUFBbEIsQ0FITCxDQUFBO0FBSUEsTUFBQSxJQUFHLFlBQUEsSUFBUSxZQUFYO0FBQ0UsUUFBQSxDQUFBLEdBQUksRUFBRyxDQUFBLENBQUEsQ0FBUCxDQUFBO0FBQUEsUUFDQSxDQUFBLEdBQUksRUFBRyxDQUFBLENBQUEsQ0FEUCxDQUFBO0FBQUEsUUFFQSxFQUFBLGNBQUssSUFBSyxFQUZWLENBQUE7QUFBQSxRQUdBLEVBQUEsY0FBSyxJQUFLLEVBSFYsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBZixHQUF1QixhQUFBLEdBQWEsRUFBYixHQUFnQixLQUp2QyxDQUFBO2VBS0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZixHQUFzQixhQUFBLEdBQWEsRUFBYixHQUFnQixNQU54QztPQUxLO0lBQUEsQ0E5Q1AsQ0FBQTs7QUFBQSxvQkEyREEsV0FBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsOEJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksRUFBWixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsR0FBa0IsUUFBUSxDQUFDLEtBRDNCLENBQUE7QUFFQTtBQUFBO1dBQUEsMkNBQUE7d0JBQUE7QUFDRSxzQkFBRyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ0QsZ0JBQUEsK0JBQUE7QUFBQTtBQUFBO2lCQUFBLDhDQUFBOzZCQUFBO0FBQ0UsNkJBQUcsQ0FBQSxTQUFDLEVBQUQsR0FBQTt1QkFDRCxLQUFDLENBQUEsUUFBUyxDQUFBLEVBQUUsQ0FBQyxJQUFILENBQVYsR0FBbUIsR0FEbEI7Y0FBQSxDQUFBLENBQUgsQ0FBSSxFQUFKLEVBQUEsQ0FERjtBQUFBOzZCQURDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSCxDQUFJLElBQUosRUFBQSxDQURGO0FBQUE7c0JBSFU7SUFBQSxDQTNEWixDQUFBOztBQUFBLG9CQW9FQSxXQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxpQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBVCxDQUFBO0FBQ0E7V0FBQSw2Q0FBQTsyQkFBQTtBQUNFLHNCQUFHLENBQUEsU0FBQyxLQUFELEdBQUE7QUFDRCxjQUFBLHFCQUFBO0FBQUEsVUFBQSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsSUFBVCxDQUFjLFFBQWQsRUFBdUIsU0FBQyxFQUFELEdBQUE7QUFDckIsZ0JBQUEsR0FBQTtBQUFBLFlBQUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxLQUFaLENBQUE7bUJBQ0EsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLFlBQVQsQ0FBc0IsVUFBdEIsRUFBaUMsR0FBakMsRUFGcUI7VUFBQSxDQUF2QixDQUFBLENBQUE7QUFBQSxVQUlBLEtBQUEsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixPQUF2QixDQUpSLENBQUE7QUFBQSxVQUtBLEtBQUssQ0FBQyxJQUFOLEdBQWEsTUFMYixDQUFBO0FBQUEsVUFNQSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVosR0FBcUIsTUFOckIsQ0FBQTtBQUFBLFVBT0EsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFwQixDQUFpQyxLQUFqQyxFQUF1QyxLQUF2QyxDQVBBLENBQUE7QUFBQSxVQVFBLEtBQUssQ0FBQyxnQkFBTixDQUF1QixRQUF2QixFQUFnQyxTQUFBLEdBQUE7bUJBQzlCLEtBQUssQ0FBQyxLQUFOLEdBQWMsS0FBSyxDQUFDLE1BRFU7VUFBQSxDQUFoQyxDQVJBLENBQUE7QUFBQSxVQVVBLEdBQUEsR0FBTSxLQUFLLENBQUMsS0FBTixJQUFlLENBVnJCLENBQUE7QUFBQSxVQVdBLEtBQUssQ0FBQyxLQUFOLEdBQWMsR0FYZCxDQUFBO0FBQUEsVUFZQSxTQUFBLEdBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBMUIsQ0FBZ0MsR0FBaEMsQ0FaWixDQUFBO0FBQUEsVUFhQSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsWUFBVCxDQUFzQjtBQUFBLFlBQUMsS0FBQSxFQUFNLFNBQVA7QUFBQSxZQUFpQixLQUFBLEVBQU0sR0FBdkI7V0FBdEIsQ0FiQSxDQUFBO2lCQWNBLENBQUEsQ0FBRSxLQUFGLENBQVEsQ0FBQyxJQUFULENBQWMsZUFBZCxFQUE4QixTQUFDLEVBQUQsRUFBSSxJQUFKLEdBQUE7bUJBQzVCLEtBQUssQ0FBQyxLQUFOLEdBQWMsSUFBSSxDQUFDLE1BRFM7VUFBQSxDQUE5QixFQWZDO1FBQUEsQ0FBQSxDQUFILENBQUksS0FBSixFQUFBLENBREY7QUFBQTtzQkFGVTtJQUFBLENBcEVaLENBQUE7O0FBQUEsb0JBeUZBLFVBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLHdDQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBVCxDQUEwQixlQUExQixDQUFmLENBQUE7QUFDQTtXQUFBLG1EQUFBO2tDQUFBO0FBQ0Usc0JBQUcsQ0FBQSxTQUFDLE1BQUQsR0FBQTtBQUNELGNBQUEsZ0JBQUE7QUFBQSxVQUFBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsb0NBQWYsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLEdBQVUsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBQSxDQURWLENBQUE7QUFBQSxVQUdBLE9BQUEsR0FBYyxJQUFBLFdBQUEsQ0FBWSxNQUFaLEVBQW1CO0FBQUEsWUFBQyxTQUFBLEVBQVUsT0FBWDtBQUFBLFlBQW1CLE1BQUEsRUFBTyxLQUExQjtXQUFuQixDQUhkLENBQUE7aUJBSUEsQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLEtBQVgsQ0FBaUIsU0FBQSxHQUFBO21CQUNmLENBQUEsQ0FBRSxPQUFGLENBQVUsQ0FBQyxXQUFYLENBQXVCLE1BQXZCLEVBRGU7VUFBQSxDQUFqQixFQUxDO1FBQUEsQ0FBQSxDQUFILENBQUksTUFBSixFQUFBLENBREY7QUFBQTtzQkFGUztJQUFBLENBekZYLENBQUE7O0FBQUEsb0JBb0dBLFVBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLDJDQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWMsUUFBUSxDQUFDLGdCQUFULENBQTBCLGtCQUExQixDQUFkLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxDQURULENBQUE7QUFFQSxXQUFBLGtEQUFBO2dDQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLEtBQXhCLENBQVIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLE1BQWxCO0FBQThCLFVBQUEsTUFBQSxHQUFPLEtBQUssQ0FBQyxNQUFiLENBQTlCO1NBRkY7QUFBQSxPQUZBO0FBQUEsTUFLQSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFmLEdBQXVCLE9BTHZCLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQWYsR0FBeUIsQ0FOekIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBZixHQUF3QixNQUFBLEdBQU8sQ0FQL0IsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQVJYLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FUQSxDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBVkEsQ0FBQTtBQVdBLE1BQUEsSUFBRyxDQUFBLElBQUUsQ0FBQSxXQUFMO0FBQ0UsUUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQURBLENBQUE7ZUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLEtBSGpCO09BWlM7SUFBQSxDQXBHWCxDQUFBOztBQUFBLG9CQXFIQSxJQUFBLEdBQUssU0FBQyxLQUFELEdBQUE7QUFDSCxVQUFBLDhFQUFBO0FBQUEsTUFBQSxJQUFPLGFBQVA7QUFDRSxlQUFPLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBUCxDQURGO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxXQUFELEdBQWUsS0FIZixDQUFBO0FBQUEsTUFJQSxTQUFBLEdBQVksS0FBSyxDQUFDLEtBSmxCLENBQUE7QUFBQSxNQUtBLFdBQUEsR0FBYyxLQUFLLENBQUMsT0FMcEIsQ0FBQTtBQUFBLE1BTUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUF1QixRQUF2QixDQU5WLENBQUE7QUFBQSxNQU9BLFNBQUEsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FQWixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsT0FBRCxHQUFXLFNBUlgsQ0FBQTtBQUFBLE1BU0EsU0FBQSxHQUFZLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUF1QixVQUF2QixDQVRaLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxPQUFELEdBQVcsU0FWWCxDQUFBO0FBQUEsTUFXQSxTQUFTLENBQUMsU0FBVixHQUFvQixFQVhwQixDQUFBO0FBQUEsTUFZQSxPQUFPLENBQUMsU0FBUixHQUFvQixTQVpwQixDQUFBO0FBQUEsTUFhQSxTQUFTLENBQUMsU0FBVixHQUFzQixXQWJ0QixDQUFBO0FBZUEsTUFBQSxJQUFHLG9CQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBQUssQ0FBQyxNQUFoQixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFWLENBSEY7T0FmQTtBQW9CQSxNQUFBLElBQUcsZ0RBQUg7QUFDRTtBQUFBLGNBQ0ssQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLElBQUQsRUFBTSxNQUFOLEdBQUE7QUFDRCxnQkFBQSxHQUFBO0FBQUEsWUFBQSxHQUFBLEdBQU0sSUFBTixDQUFBO0FBQUEsWUFDQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FETixDQUFBO0FBQUEsWUFFQSxHQUFHLENBQUMsU0FBSixHQUFnQixpQkFGaEIsQ0FBQTtBQUFBLFlBR0EsR0FBRyxDQUFDLFNBQUosR0FBZ0IsSUFIaEIsQ0FBQTtBQUFBLFlBSUEsR0FBRyxDQUFDLGdCQUFKLENBQXFCLE9BQXJCLEVBQTZCLFNBQUMsRUFBRCxHQUFBO3FCQUMzQixNQUFBLENBQU8sRUFBUCxFQUFVLEtBQVYsRUFEMkI7WUFBQSxDQUE3QixDQUpBLENBQUE7bUJBTUEsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsR0FBdEIsRUFQQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREw7QUFBQSxhQUFBLFlBQUE7OEJBQUE7QUFDRSxjQUFJLE1BQUssT0FBVCxDQURGO0FBQUEsU0FERjtPQXBCQTtBQUFBLE1BK0JBLElBQUMsQ0FBQSxVQUFELENBQUEsQ0EvQkEsQ0FBQTtBQWdDQSxNQUFBLElBQUcsK0NBQUg7ZUFDRSxLQUFLLENBQUMsTUFBTixDQUFhLElBQWIsRUFERjtPQWpDRztJQUFBLENBckhMLENBQUE7O0FBQUEsb0JBeUpBLElBQUEsR0FBSyxTQUFDLElBQUQsR0FBQTtBQUNILE1BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBZixHQUF5QixDQUF6QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBRFgsQ0FBQTthQUVBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ1QsVUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFmLEdBQXlCLE1BQXpCLENBQUE7QUFDQSxVQUFBLElBQUcsb0JBQUg7QUFDRSxZQUFBLEtBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixDQUFBLENBREY7V0FEQTtBQUdBLFVBQUEsSUFBRyxZQUFIO21CQUFjLElBQUEsQ0FBQSxFQUFkO1dBSlM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBS0UsSUFBQyxDQUFBLFFBTEgsRUFIRztJQUFBLENBekpMLENBQUE7O0FBQUEsb0JBbUtBLEtBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsSUFBRCxDQUFNLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ0osS0FBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCLEdBRGpCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTixFQURJO0lBQUEsQ0FuS04sQ0FBQTs7QUFBQSxvQkF1S0EsT0FBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNKLFVBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUEsQ0FBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBQSxNQUZJO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTixFQURNO0lBQUEsQ0F2S1IsQ0FBQTs7QUFBQSxvQkE0S0EsT0FBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQXVCLFVBQXZCLENBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBRyxLQUFIO2VBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLEdBQW1CLFFBRHJCO09BQUEsTUFBQTtlQUdFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxHQUFtQixPQUhyQjtPQUZNO0lBQUEsQ0E1S1IsQ0FBQTs7aUJBQUE7O01BUEYsQ0FBQTs7QUFBQSxFQTBMQSxNQUFNLENBQUMsT0FBUCxHQUFpQixLQTFMakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/soviet/.atom/packages/editor-background/lib/popup.coffee

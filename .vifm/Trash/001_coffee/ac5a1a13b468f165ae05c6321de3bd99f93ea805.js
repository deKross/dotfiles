
/*
 jQuery Simple Slider

 Copyright (c) 2012 James Smith (http://loopj.com)

 Licensed under the MIT license (http://mit-license.org/)
 */

(function() {
  var $,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = require('atom-space-pen-views').$;

  (function($, window) {
    var SimpleSlider;
    SimpleSlider = (function() {
      function SimpleSlider(input, options) {
        var ratio;
        this.input = input;
        this.defaultOptions = {
          animate: true,
          snapMid: false,
          classPrefix: null,
          classSuffix: null,
          theme: null,
          highlight: false
        };
        this.settings = $.extend({}, this.defaultOptions, options);
        if (this.settings.theme) {
          this.settings.classSuffix = "-" + this.settings.theme;
        }
        this.input.hide();
        this.slider = $("<div>").addClass("slider" + (this.settings.classSuffix || "")).css({
          position: "relative",
          userSelect: "none",
          boxSizing: "border-box"
        }).insertBefore(this.input);
        if (this.input.attr("id")) {
          this.slider.attr("id", this.input.attr("id") + "-slider");
        }
        this.track = this.createDivElement("track").css({
          width: "100%"
        });
        if (this.settings.highlight) {
          this.highlightTrack = this.createDivElement("highlight-track").css({
            width: "0"
          });
        }
        this.dragger = this.createDivElement("dragger");
        this.slider.css({
          minHeight: this.dragger.outerHeight(),
          marginLeft: this.dragger.outerWidth() / 2,
          marginRight: this.dragger.outerWidth() / 2
        });
        this.track.css({
          marginTop: this.track.outerHeight() / -2
        });
        if (this.settings.highlight) {
          this.highlightTrack.css({
            marginTop: this.track.outerHeight() / -2
          });
        }
        this.dragger.css({
          marginTop: this.dragger.outerHeight() / -2,
          marginLeft: this.dragger.outerWidth() / -2
        });
        this.track.mousedown((function(_this) {
          return function(e) {
            return _this.trackEvent(e);
          };
        })(this));
        if (this.settings.highlight) {
          this.highlightTrack.mousedown((function(_this) {
            return function(e) {
              return _this.trackEvent(e);
            };
          })(this));
        }
        this.dragger.mousedown((function(_this) {
          return function(e) {
            if (e.which !== 1) {
              return;
            }
            _this.dragging = true;
            _this.dragger.addClass("dragging");
            _this.domDrag(e.pageX, e.pageY);
            return false;
          };
        })(this));
        $("body").mousemove((function(_this) {
          return function(e) {
            if (_this.dragging) {
              _this.domDrag(e.pageX, e.pageY);
              return $("body").css({
                cursor: "pointer"
              });
            }
          };
        })(this)).mouseup((function(_this) {
          return function(e) {
            if (_this.dragging) {
              _this.dragging = false;
              _this.dragger.removeClass("dragging");
              return $("body").css({
                cursor: "auto"
              });
            }
          };
        })(this));
        this.pagePos = 0;
        if (this.input.val() === "") {
          this.value = this.getRange().min;
          this.input.val(this.value);
        } else {
          this.value = this.nearestValidValue(this.input.val());
        }
        this.setSliderPositionFromValue(this.value);
        ratio = this.valueToRatio(this.value);
        this.input.trigger("slider-ready", {
          value: this.value,
          ratio: ratio,
          position: ratio * this.slider.outerWidth(),
          el: this.slider
        });
      }

      SimpleSlider.prototype.createDivElement = function(classname) {
        var item;
        item = $("<div>").addClass(classname).css({
          position: "absolute",
          top: "50%",
          userSelect: "none",
          cursor: "pointer"
        }).appendTo(this.slider);
        return item;
      };

      SimpleSlider.prototype.setRatio = function(ratio) {
        var value;
        ratio = Math.min(1, ratio);
        ratio = Math.max(0, ratio);
        value = this.ratioToValue(ratio);
        this.setSliderPositionFromValue(value);
        return this.valueChanged(value, ratio, "setRatio");
      };

      SimpleSlider.prototype.setValue = function(value) {
        var ratio;
        value = this.nearestValidValue(value);
        ratio = this.valueToRatio(value);
        this.setSliderPositionFromValue(value);
        return this.valueChanged(value, ratio, "setValue");
      };

      SimpleSlider.prototype.trackEvent = function(e) {
        if (e.which !== 1) {
          return;
        }
        this.domDrag(e.pageX, e.pageY, true);
        this.dragging = true;
        return false;
      };

      SimpleSlider.prototype.domDrag = function(pageX, pageY, animate) {
        var pagePos, ratio, value;
        if (animate == null) {
          animate = false;
        }
        pagePos = pageX - this.slider.offset().left;
        pagePos = Math.min(this.slider.outerWidth(), pagePos);
        pagePos = Math.max(0, pagePos);
        if (this.pagePos !== pagePos) {
          this.pagePos = pagePos;
          ratio = pagePos / this.slider.outerWidth();
          value = this.ratioToValue(ratio);
          this.valueChanged(value, ratio, "domDrag");
          if (this.settings.snap) {
            return this.setSliderPositionFromValue(value, animate);
          } else {
            return this.setSliderPosition(pagePos, animate);
          }
        }
      };

      SimpleSlider.prototype.setSliderPosition = function(position, animate) {
        if (animate == null) {
          animate = false;
        }
        if (animate && this.settings.animate) {
          this.dragger.animate({
            left: position
          }, 200);
          if (this.settings.highlight) {
            return this.highlightTrack.animate({
              width: position
            }, 200);
          }
        } else {
          this.dragger.css({
            left: position
          });
          if (this.settings.highlight) {
            return this.highlightTrack.css({
              width: position
            });
          }
        }
      };

      SimpleSlider.prototype.setSliderPositionFromValue = function(value, animate) {
        var ratio;
        if (animate == null) {
          animate = false;
        }
        ratio = this.valueToRatio(value);
        return this.setSliderPosition(ratio * this.slider.outerWidth(), animate);
      };

      SimpleSlider.prototype.getRange = function() {
        if (this.settings.allowedValues) {
          return {
            min: Math.min.apply(Math, this.settings.allowedValues),
            max: Math.max.apply(Math, this.settings.allowedValues)
          };
        } else if (this.settings.range) {
          return {
            min: parseFloat(this.settings.range[0]),
            max: parseFloat(this.settings.range[1])
          };
        } else {
          return {
            min: 0,
            max: 1
          };
        }
      };

      SimpleSlider.prototype.nearestValidValue = function(rawValue) {
        var closest, maxSteps, range, steps;
        range = this.getRange();
        rawValue = Math.min(range.max, rawValue);
        rawValue = Math.max(range.min, rawValue);
        if (this.settings.allowedValues) {
          closest = null;
          $.each(this.settings.allowedValues, function() {
            if (closest === null || Math.abs(this - rawValue) < Math.abs(closest - rawValue)) {
              return closest = this;
            }
          });
          return closest;
        } else if (this.settings.step) {
          maxSteps = (range.max - range.min) / this.settings.step;
          steps = Math.floor((rawValue - range.min) / this.settings.step);
          if ((rawValue - range.min) % this.settings.step > this.settings.step / 2 && steps < maxSteps) {
            steps += 1;
          }
          return steps * this.settings.step + range.min;
        } else {
          return rawValue;
        }
      };

      SimpleSlider.prototype.valueToRatio = function(value) {
        var allowedVal, closest, closestIdx, idx, range, _i, _len, _ref;
        if (this.settings.equalSteps) {
          _ref = this.settings.allowedValues;
          for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
            allowedVal = _ref[idx];
            if ((typeof closest === "undefined" || closest === null) || Math.abs(allowedVal - value) < Math.abs(closest - value)) {
              closest = allowedVal;
              closestIdx = idx;
            }
          }
          if (this.settings.snapMid) {
            return (closestIdx + 0.5) / this.settings.allowedValues.length;
          } else {
            return closestIdx / (this.settings.allowedValues.length - 1);
          }
        } else {
          range = this.getRange();
          return (value - range.min) / (range.max - range.min);
        }
      };

      SimpleSlider.prototype.ratioToValue = function(ratio) {
        var idx, range, rawValue, step, steps;
        if (this.settings.equalSteps) {
          steps = this.settings.allowedValues.length;
          step = Math.round(ratio * steps - 0.5);
          idx = Math.min(step, this.settings.allowedValues.length - 1);
          return this.settings.allowedValues[idx];
        } else {
          range = this.getRange();
          rawValue = ratio * (range.max - range.min) + range.min;
          return this.nearestValidValue(rawValue);
        }
      };

      SimpleSlider.prototype.valueChanged = function(value, ratio, trigger) {
        var eventData;
        if (value.toString() === this.value.toString()) {
          return;
        }
        this.value = value;
        eventData = {
          value: value,
          ratio: ratio,
          position: ratio * this.slider.outerWidth(),
          trigger: trigger,
          el: this.slider
        };
        return this.input.val(value).trigger($.Event("change", eventData)).trigger("sliderchanged", eventData);
      };

      return SimpleSlider;

    })();
    return $.extend($.fn, {
      simpleSlider: function() {
        var params, publicMethods, settingsOrMethod;
        settingsOrMethod = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        publicMethods = ["setRatio", "setValue"];
        $(this).each(function() {
          var obj, settings;
          if (settingsOrMethod && __indexOf.call(publicMethods, settingsOrMethod) >= 0) {
            obj = $(this).data("slider-object");
            return obj[settingsOrMethod].apply(obj, params);
          } else {
            settings = settingsOrMethod;
            return $(this).data("slider-object", new SimpleSlider($(this), settings));
          }
        });
        return $("[data-slider]").each(function() {
          var $el, allowedValues, settings, x;
          $el = $(this);
          settings = {};
          allowedValues = $el.data("slider-values");
          if (allowedValues) {
            settings.allowedValues = (function() {
              var _i, _len, _ref, _results;
              _ref = allowedValues.split(",");
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                x = _ref[_i];
                _results.push(parseFloat(x));
              }
              return _results;
            })();
          }
          if ($el.data("slider-range")) {
            settings.range = $el.data("slider-range").split(",");
          }
          if ($el.data("slider-step")) {
            settings.step = $el.data("slider-step");
          }
          settings.snap = $el.data("slider-snap");
          settings.equalSteps = $el.data("slider-equal-steps");
          if ($el.data("slider-theme")) {
            settings.theme = $el.data("slider-theme");
          }
          if ($el.attr("data-slider-highlight")) {
            settings.highlight = $el.data("slider-highlight");
          }
          if ($el.data("slider-animate") != null) {
            settings.animate = $el.data("slider-animate");
          }
          return $el.simpleSlider(settings);
        });
      }
    });
  })($, window);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZWRpdG9yLWJhY2tncm91bmQvbGliL3NpbXBsZVNsaWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOzs7Ozs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLENBQUE7SUFBQTt5SkFBQTs7QUFBQSxFQU9BLENBQUEsR0FBSSxPQUFBLENBQVEsc0JBQVIsQ0FBK0IsQ0FBQyxDQVBwQyxDQUFBOztBQUFBLEVBU0EsQ0FBQyxTQUFDLENBQUQsRUFBSSxNQUFKLEdBQUE7QUFNQyxRQUFBLFlBQUE7QUFBQSxJQUFNO0FBR1MsTUFBQSxzQkFBRSxLQUFGLEVBQVMsT0FBVCxHQUFBO0FBRVgsWUFBQSxLQUFBO0FBQUEsUUFGWSxJQUFDLENBQUEsUUFBQSxLQUViLENBQUE7QUFBQSxRQUFBLElBQUMsQ0FBQSxjQUFELEdBQ0U7QUFBQSxVQUFBLE9BQUEsRUFBUyxJQUFUO0FBQUEsVUFDQSxPQUFBLEVBQVMsS0FEVDtBQUFBLFVBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxVQUdBLFdBQUEsRUFBYSxJQUhiO0FBQUEsVUFJQSxLQUFBLEVBQU8sSUFKUDtBQUFBLFVBS0EsU0FBQSxFQUFXLEtBTFg7U0FERixDQUFBO0FBQUEsUUFRQSxJQUFDLENBQUEsUUFBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsRUFBVCxFQUFhLElBQUMsQ0FBQSxjQUFkLEVBQThCLE9BQTlCLENBUlosQ0FBQTtBQVNBLFFBQUEsSUFBaUQsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUEzRDtBQUFBLFVBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLEdBQXlCLEdBQUEsR0FBRyxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQXRDLENBQUE7U0FUQTtBQUFBLFFBWUEsSUFBQyxDQUFBLEtBQUssQ0FB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

//# sourceURL=/C:/Users/soviet/.atom/packages/editor-background/lib/simpleSlider.coffee

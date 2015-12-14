(function() {
  var $, ConfigWindow, fs, popup;

  fs = require('fs');

  $ = require('atom-space-pen-views').$;

  popup = require('./popup');

  ConfigWindow = (function() {
    var buttons, content, settings, title;

    title = null;

    content = null;

    buttons = null;

    settings = {};

    function ConfigWindow(packageName, options) {
      this.packageName = packageName;
      if ((options != null ? options.onChange : void 0) != null) {
        this.onChange = options.onChange;
      }
      if ((options != null ? options.onshow : void 0) != null) {
        this.onShow = options.onShow;
      }
      if ((options != null ? options.onHide : void 0) != null) {
        this.onHide = options.onHide;
      }
      this.html = '';
      this.popup = new popup();
      this.cleanPackageName = this.cleanName(this.packageName);
      this.title = this.cleanPackageName + " settings";
      this.loadSettings();
    }

    ConfigWindow.prototype.type = function(object) {
      var funcNameRegex, res;
      funcNameRegex = /function (.{1,})\(/;
      if ((object != null ? object.constructor : void 0) != null) {
        res = funcNameRegex.exec(object.constructor.toString());
        if ((res != null ? res[1] : void 0) != null) {
          return res[1];
        } else {
          return null;
        }
      } else {
        return null;
      }
    };

    ConfigWindow.prototype.upper = function(match) {
      return match.toUpperCase();
    };

    ConfigWindow.prototype.lower = function(match) {
      return match.toLowerCase();
    };

    ConfigWindow.prototype.cleanName = function(name) {
      var dotPos, result;
      dotPos = name.lastIndexOf('.');
      if (dotPos > -1) {
        result = name.substr(dotPos + 1, name.length - dotPos - 1);
      } else {
        result = name;
      }
      result = result.replace('-', ' ').replace(/([a-z]+)([A-Z]+)/g, "$1 $2").replace(/^[a-z].(.*)/gi, this.lower).replace(/^([a-z]{1})/gi, this.upper);
      return result;
    };

    ConfigWindow.prototype.getConfigValue = function(name, obj) {
      var fullPath, schema, value;
      fullPath = name;
      value = atom.config.get(fullPath);
      schema = atom.config.getSchema(fullPath);
      if (value == null) {
        if ((obj != null ? obj["default"] : void 0) != null) {
          value = obj["default"];
        } else {
          if ((schema != null ? schema["default"] : void 0) != null) {
            value = schema["default"];
            value = atom.config.makeValueConformToSchema(fullPath, value);
          }
        }
      }
      return value;
    };

    ConfigWindow.prototype.schemaToInternalConfig = function(fullPath) {
      var config, key, props, result, schema, type, val, _fn, _fn1;
      result = {};
      schema = atom.config.getSchema(fullPath);
      type = schema.type;
      if (type === 'object') {
        props = schema.properties;
        _fn = (function(_this) {
          return function(key, val) {
            return result[key] = _this.schemaToInternalConfig(fullPath + '.' + key);
          };
        })(this);
        for (key in props) {
          val = props[key];
          _fn(key, val);
        }
      } else {
        _fn1 = function(key, val) {
          return result[key] = val;
        };
        for (key in schema) {
          val = schema[key];
          _fn1(key, val);
        }
        result.value = atom.config.makeValueConformToSchema(fullPath, schema["default"]);
        config = atom.config.get(fullPath);
        if (config != null) {
          result.value = config;
        }
      }
      return result;
    };

    ConfigWindow.prototype.get = function(fullPath) {
      var internalConfig, key, keys, result, _fn, _i, _len;
      internalConfig = this.schemaToInternalConfig(fullPath);
      result = {};
      if (internalConfig != null) {
        keys = Object.keys(internalConfig);
        if ((internalConfig.type == null) && keys !== []) {
          _fn = (function(_this) {
            return function(key) {
              return result[key] = _this.get(fullPath + '.' + key);
            };
          })(this);
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            _fn(key);
          }
        } else {
          result = internalConfig.value;
        }
      }
      return result;
    };

    ConfigWindow.prototype.getChildCleanName = function(name, obj) {
      var cleanName;
      cleanName = this.cleanName(name);
      if (obj.title != null) {
        cleanName = obj.title;
      }
      return cleanName;
    };

    ConfigWindow.prototype.parseFileChild = function(name, obj) {
      var cleanName, value;
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      if (value == null) {
        value = '';
      }
      return "<div class='group'> <label for='" + name + "'>" + cleanName + "</label> <input type='text' class='file-text' name='" + name + "' id='" + name + "' value='" + value + "'><button class='btn btn-default file-btn'>...</button> <input type='file' id='file-" + name + "' style='display:none;'> </div>";
    };

    ConfigWindow.prototype.parseTextChild = function(name, obj) {
      var cleanName, value;
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      if (value == null) {
        value = '';
      }
      return "<div class='group'> <label for='" + name + "'>" + cleanName + "</label> <textarea class='file-text' name='" + name + "' id='" + name + "' value='" + value + "'>" + value + "</textarea> </div>";
    };

    ConfigWindow.prototype.parseStringChild = function(name, obj) {
      var cleanName, value;
      if (obj.toolbox != null) {
        if (obj.toolbox === 'file') {
          return this.parseFileChild(name, obj);
        }
        if (obj.toolbox === 'text') {
          return this.parseTextChild(name, obj);
        }
        if (obj.toolbox === 'ignore') {
          return "";
        }
      }
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      if (value == null) {
        value = '';
      }
      return "<div class='group'> <label for='" + name + "'>" + cleanName + "</label> <input type='text' name='" + name + "' id='" + name + "' value='" + value + "'> </div>";
    };

    ConfigWindow.prototype.parseSliderChild = function(name, obj, step) {
      var cleanName, max, min, value;
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      min = obj.minimum;
      max = obj.maximum;
      return "<div class='group'> <label for='" + name + "'>" + cleanName + "</label> <input type='number' class='range' data-slider-range='" + min + "," + max + "' data-slider-step='" + step + "' name='" + name + "' id='" + name + "' value='" + value + "'> </div>";
    };

    ConfigWindow.prototype.parseIntegerChild = function(name, obj) {
      var cleanName, step, value;
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      if ((obj.minimum != null) && (obj.maximum != null)) {
        step = 1;
        if (obj.step != null) {
          step = obj.step;
        }
        return this.parseSliderChild(name, obj, step);
      } else {
        return "<div class='group'> <label for='" + name + "'>" + cleanName + "</label> <input type='number' name='" + name + "' id='" + name + "' value='" + value + "'> </div>";
      }
    };

    ConfigWindow.prototype.parseNumberChild = function(name, obj) {
      var cleanName, step, value;
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      if ((obj.minimum != null) && (obj.maximum != null)) {
        step = 1;
        if (obj.step != null) {
          step = obj.step;
        }
        return this.parseIntegerSlider(name, obj, step);
      } else {
        return "<div class='group'> <label for='" + name + "'>" + cleanName + "</label> <input type='text' name='" + name + "' id='" + name + "' value='" + value + "'> </div>";
      }
    };

    ConfigWindow.prototype.parseBooleanChild = function(name, obj) {
      var checked, cleanName, value;
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      checked = '';
      if (value) {
        checked = " checked='checked' ";
      }
      return "<div class='group'> <label><input type='checkbox' name='" + name + "' id='" + name + "' " + checked + ">" + cleanName + "</label> </div>";
    };

    ConfigWindow.prototype.parseArrayChild = function(name, obj) {
      return '';
    };

    ConfigWindow.prototype.parseEnumOptions = function(options, selected) {
      var option, result, _fn, _i, _len;
      result = '';
      _fn = function(option) {
        var sel;
        sel = '';
        if (selected === option) {
          sel = 'selected="selected"';
        }
        return result += "<option value='" + option + "' " + sel + ">" + option + "</option>";
      };
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        _fn(option);
      }
      return result;
    };

    ConfigWindow.prototype.parseEnumChild = function(name, obj) {
      var cleanName, options, value;
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      options = this.parseEnumOptions(obj["enum"], value);
      return "<div class='group'> <label for='" + name + "'>" + cleanName + "</label> <select name='" + name + "' id='" + name + "'> " + options + " </select> </div>";
    };

    ConfigWindow.prototype.parseColorChild = function(name, obj) {
      var cleanName, value;
      cleanName = this.getChildCleanName(name, obj);
      value = this.getConfigValue(name, obj);
      value = value.toHexString();
      return "<div class='group'> <label for='" + name + "'>" + cleanName + "</label> <input type='text' class='color-picker' name='" + name + "' id='" + name + "' value='" + value + "'> </div>";
    };

    ConfigWindow.prototype.parseTabChild = function(name, value, level, path) {
      var parsers;
      parsers = {
        'string': (function(_this) {
          return function(name, value) {
            return _this.parseStringChild(name, value);
          };
        })(this),
        'integer': (function(_this) {
          return function(name, value) {
            return _this.parseIntegerChild(name, value);
          };
        })(this),
        'number': (function(_this) {
          return function(name, value) {
            return _this.parseNumberChild(name, value);
          };
        })(this),
        'boolean': (function(_this) {
          return function(name, value) {
            return _this.parseBooleanChild(name, value);
          };
        })(this),
        'object': (function(_this) {
          return function(name, value) {
            return _this.parseObjectChild(name, value);
          };
        })(this),
        'array': (function(_this) {
          return function(name, value) {
            return _this.parseArrayChild(name, value);
          };
        })(this),
        'color': (function(_this) {
          return function(name, value) {
            return _this.parseColorChild(name, value);
          };
        })(this)
      };
      if (value["enum"] == null) {
        return parsers[value.type](path, value, level + 1);
      } else {
        return this.parseEnumChild(path, value, level + 1);
      }
    };

    ConfigWindow.prototype.makeTabs = function(name, obj, level, path) {
      var cleanName, html, index, key, props, tab, tabs, value, _fn, _fn1, _i, _len;
      cleanName = this.getChildCleanName(name, obj);
      props = obj.properties;
      tabs = Object.keys(props);
      level = 0;
      html = "<div class='config-tabs'>";
      index = 0;
      _fn = (function(_this) {
        return function(tab) {
          var tabText;
          if (props[tab].toolbox == null) {
            tabText = _this.cleanName(tab);
            return html += "<div class='tab' id='tab-index-" + index + "'>" + tabText + "</div>";
          }
        };
      })(this);
      for (_i = 0, _len = tabs.length; _i < _len; _i++) {
        tab = tabs[_i];
        _fn(tab);
      }
      html += "</div>";
      html += "<div class='config-content'>";
      _fn1 = (function(_this) {
        return function(key, value) {
          if (value.toolbox == null) {
            html += "<div class='tab-content' id='content-tab-index-" + index + "'>";
            html += _this.parseObjectChild(key, value, 1, path + '.' + key);
            return html += "</div>";
          }
        };
      })(this);
      for (key in props) {
        value = props[key];
        _fn1(key, value);
      }
      html += "</div>";
      return html;
    };

    ConfigWindow.prototype.parseObjectChild = function(name, obj, level, path) {
      var html, key, props, value, _fn;
      if (level == null) {
        level = 0;
      }
      if (path == null) {
        path = '';
      }
      if (level > 10) {
        console.error('too much levels... :/');
        throw new Error('something goes terribly wrong... I\'m going out of here');
        return;
      }
      html = '';
      if (level === 0) {
        html += this.makeTabs(name, obj, 0, name);
      } else {
        props = obj.properties;
        _fn = (function(_this) {
          return function(key, value) {
            return html += _this.parseTabChild(key, value, level + 1, path + '.' + key);
          };
        })(this);
        for (key in props) {
          value = props[key];
          _fn(key, value);
        }
      }
      return html;
    };

    ConfigWindow.prototype.addButtons = function() {
      var applyBtn, closeBtn, html;
      html = "<button id='apply-btn' class='btn btn-default popup-btn'>Apply</button> <button id='close-btn' class='btn btn-default popup-btn'>Close</button>";
      this.popup.buttons.innerHTML = html;
      applyBtn = this.popup.element.querySelector('#apply-btn');
      applyBtn.addEventListener('click', (function(_this) {
        return function(ev) {
          return _this.applyConfig(ev);
        };
      })(this));
      closeBtn = this.popup.element.querySelector('#close-btn');
      return closeBtn.addEventListener('click', (function(_this) {
        return function(ev) {
          return _this.close(ev);
        };
      })(this));
    };

    ConfigWindow.prototype.loadSettings = function() {
      var index, _fn, _i, _ref;
      this.settings = {};
      this.schema = atom.config.schema.properties[this.packageName];
      this.config = atom.config.get(this.packageName);
      this["default"] = atom.config.get(this.packageName);
      this.path = '';
      this.html = '<div id="editor-background-config">';
      this.html += this.parseObjectChild(this.packageName, this.schema, 0);
      this.html += "</div>";
      this.popup.content.innerHTML = this.html;
      this.popup.title.innerHTML = this.cleanPackageName;
      this.configWnd = this.popup.element.querySelector('.content');
      this.tabs = this.configWnd.querySelectorAll('.tab');
      this.tabsContent = this.configWnd.querySelectorAll('.tab-content');
      _fn = (function(_this) {
        return function(index) {
          return _this.tabs[index].addEventListener('click', function(ev) {
            return _this.activateTab(index);
          });
        };
      })(this);
      for (index = _i = 0, _ref = this.tabs.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
        _fn(index);
      }
      this.activateTab(0);
      this.bindEvents();
      return this.addButtons();
    };

    ConfigWindow.prototype.saveSettings = function(settings) {
      var elem, elements, key, val, values, _fn, _i, _len, _results;
      values = {};
      elements = this.popup.content.elements;
      _fn = function(elem) {
        var name;
        name = elem.name;
        if (name !== '') {
          if (elem.type === 'checkbox') {
            return values[name] = elem.checked;
          } else {
            return values[name] = elem.value;
          }
        }
      };
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        elem = elements[_i];
        _fn(elem);
      }
      _results = [];
      for (key in values) {
        val = values[key];
        _results.push((function(key, val) {
          return atom.config.set(key, val);
        })(key, val));
      }
      return _results;
    };

    ConfigWindow.prototype.fileChooser = function(ev) {
      var elem;
      elem = ev.target;
      return $(elem).parent().children('input[type="file"]').click();
    };

    ConfigWindow.prototype.fileChanged = function(ev) {
      var file, path;
      if (ev.target.files[0] != null) {
        file = ev.target.files[0];
        path = file.path.replace(/\\/gi, '/');
        return $(ev.target).parent().children('input[type="text"]').val(path);
      }
    };

    ConfigWindow.prototype.bindEvents = function() {
      var file;
      $(this.configWnd).find('.file-btn').on('click', (function(_this) {
        return function(ev) {
          return _this.fileChooser(ev);
        };
      })(this));
      file = this.configWnd.querySelector('input[type="file"]');
      return file.addEventListener('change', (function(_this) {
        return function(ev) {
          return _this.fileChanged(ev);
        };
      })(this));
    };

    ConfigWindow.prototype.applyConfig = function(ev) {
      this.saveSettings();
      if (this.onChange != null) {
        return this.onChange();
      }
    };

    ConfigWindow.prototype.close = function(ev) {
      return this.popup.hide();
    };

    ConfigWindow.prototype.activateTab = function(index) {
      var i, j, _fn, _fn1, _i, _j, _ref, _ref1;
      this.tabs = $(this.popup.element).find('.tab');
      _fn = (function(_this) {
        return function(i) {
          if (i === index) {
            return _this.tabs[i].className = 'tab active';
          } else {
            return _this.tabs[i].className = 'tab';
          }
        };
      })(this);
      for (i = _i = 0, _ref = this.tabs.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        _fn(i);
      }
      this.tabsContent = $(this.popup.element).find('.tab-content');
      _fn1 = (function(_this) {
        return function(j) {
          if (j === index) {
            return _this.tabsContent[j].className = "tab-content active";
          } else {
            return _this.tabsContent[j].className = "tab-content";
          }
        };
      })(this);
      for (j = _j = 0, _ref1 = this.tabsContent.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        _fn1(j);
      }
      return this.popup.center();
    };

    ConfigWindow.prototype.show = function() {
      return this.popup.show();
    };

    ConfigWindow.prototype.hide = function() {
      return this.popup.hide();
    };

    return ConfigWindow;

  })();

  module.exports = ConfigWindow;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZWRpdG9yLWJhY2tncm91bmQvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEJBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0MsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQURELENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FGUixDQUFBOztBQUFBLEVBSU07QUFFSixRQUFBLGlDQUFBOztBQUFBLElBQUEsS0FBQSxHQUFRLElBQVIsQ0FBQTs7QUFBQSxJQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7O0FBQUEsSUFFQSxPQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLElBR0EsUUFBQSxHQUFXLEVBSFgsQ0FBQTs7QUFNWSxJQUFBLHNCQUFFLFdBQUYsRUFBYyxPQUFkLEdBQUE7QUFFVixNQUZXLElBQUMsQ0FBQSxjQUFBLFdBRVosQ0FBQTtBQUFBLE1BQUEsSUFBRyxxREFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxPQUFPLENBQUMsUUFBcEIsQ0FERjtPQUFBO0FBRUEsTUFBQSxJQUFHLG1EQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE9BQU8sQ0FBQyxNQUFsQixDQURGO09BRkE7QUFJQSxNQUFBLElBQUcsbURBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsT0FBTyxDQUFDLE1BQWxCLENBREY7T0FKQTtBQUFBLE1BTUEsSUFBQyxDQUFBLElBQUQsR0FBUSxFQU5SLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFBLENBQUEsQ0FQYixDQUFBO0FBQUEsTUFR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

//# sourceURL=/C:/Users/soviet/.atom/packages/editor-background/lib/config.coffee

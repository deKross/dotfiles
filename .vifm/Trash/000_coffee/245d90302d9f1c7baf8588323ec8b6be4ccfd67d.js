(function() {
  var $, BufferedProcess, MinimapPluginGeneratorView, TextEditorView, View, fs, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ = require('underscore-plus');

  _ref = require('atom'), $ = _ref.$, BufferedProcess = _ref.BufferedProcess, TextEditorView = _ref.TextEditorView, View = _ref.View;

  fs = require('fs-plus');

  module.exports = MinimapPluginGeneratorView = (function(_super) {
    __extends(MinimapPluginGeneratorView, _super);

    function MinimapPluginGeneratorView() {
      return MinimapPluginGeneratorView.__super__.constructor.apply(this, arguments);
    }

    MinimapPluginGeneratorView.prototype.previouslyFocusedElement = null;

    MinimapPluginGeneratorView.prototype.mode = null;

    MinimapPluginGeneratorView.content = function() {
      return this.div({
        "class": 'minimap-plugin-generator overlay from-top'
      }, (function(_this) {
        return function() {
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          _this.div({
            "class": 'error',
            outlet: 'error'
          });
          return _this.div({
            "class": 'message',
            outlet: 'message'
          });
        };
      })(this));
    };

    MinimapPluginGeneratorView.prototype.initialize = function() {
      this.miniEditor.hiddenInput.on('focusout', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
      this.on('core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      this.on('core:cancel', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
      return this.attach('plugin');
    };

    MinimapPluginGeneratorView.prototype.attach = function(mode) {
      this.mode = mode;
      this.previouslyFocusedElement = $(':focus');
      this.message.text("Enter " + mode + " path");
      atom.views.getView(atom.workspace).appendChild(this.element);
      this.setPathText("my-minimap-plugin");
      return this.miniEditor.focus();
    };

    MinimapPluginGeneratorView.prototype.setPathText = function(placeholderName, rangeToSelect) {
      var editor, endOfDirectoryIndex, packagesDirectory, pathLength;
      editor = this.miniEditor.editor;
      if (rangeToSelect == null) {
        rangeToSelect = [0, placeholderName.length];
      }
      packagesDirectory = this.getPackagesDirectory();
      editor.setText(path.join(packagesDirectory, placeholderName));
      pathLength = editor.getText().length;
      endOfDirectoryIndex = pathLength - placeholderName.length;
      return editor.setSelectedBufferRange([[0, endOfDirectoryIndex + rangeToSelect[0]], [0, endOfDirectoryIndex + rangeToSelect[1]]]);
    };

    MinimapPluginGeneratorView.prototype.detach = function() {
      var _ref1;
      if (!this.hasParent()) {
        return;
      }
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return MinimapPluginGeneratorView.__super__.detach.apply(this, arguments);
    };

    MinimapPluginGeneratorView.prototype.confirm = function() {
      if (this.validPackagePath()) {
        return this.createPackageFiles((function(_this) {
          return function() {
            var packagePath;
            packagePath = _this.getPackagePath();
            atom.open({
              pathsToOpen: [packagePath]
            });
            return _this.detach();
          };
        })(this));
      }
    };

    MinimapPluginGeneratorView.prototype.getPackagePath = function() {
      var packageName, packagePath;
      packagePath = this.miniEditor.getText();
      packageName = _.dasherize(path.basename(packagePath));
      return path.join(path.dirname(packagePath), packageName);
    };

    MinimapPluginGeneratorView.prototype.getPackagesDirectory = function() {
      return atom.config.get('core.projectHome') || process.env.ATOM_REPOS_HOME || path.join(fs.getHomeDirectory(), 'github');
    };

    MinimapPluginGeneratorView.prototype.validPackagePath = function() {
      if (fs.existsSync(this.getPackagePath())) {
        this.error.text("Path already exists at '" + (this.getPackagePath()) + "'");
        this.error.show();
        return false;
      } else {
        return true;
      }
    };

    MinimapPluginGeneratorView.prototype.initPackage = function(packagePath, callback) {
      var templatePath;
      templatePath = path.resolve(__dirname, path.join('..', 'templates', 'plugin'));
      return this.runCommand(atom.packages.getApmPath(), ['init', "-p", "" + packagePath, "--template", templatePath], callback);
    };

    MinimapPluginGeneratorView.prototype.linkPackage = function(packagePath, callback) {
      var args;
      args = ['link'];
      if (atom.config.get('package-generator.createInDevMode')) {
        args.push('--dev');
      }
      args.push(packagePath.toString());
      return this.runCommand(atom.packages.getApmPath(), args, callback);
    };

    MinimapPluginGeneratorView.prototype.installPackage = function(packagePath, callback) {
      var args;
      args = ['install'];
      return this.runCommand(atom.packages.getApmPath(), args, callback, {
        cwd: packagePath
      });
    };

    MinimapPluginGeneratorView.prototype.isStoredInDotAtom = function(packagePath) {
      var devPackagesPath, packagesPath;
      packagesPath = path.join(atom.getConfigDirPath(), 'packages', path.sep);
      if (packagePath.indexOf(packagesPath) === 0) {
        return true;
      }
      devPackagesPath = path.join(atom.getConfigDirPath(), 'dev', 'packages', path.sep);
      return packagePath.indexOf(devPackagesPath) === 0;
    };

    MinimapPluginGeneratorView.prototype.createPackageFiles = function(callback) {
      var packagePath, packagesDirectory;
      packagePath = this.getPackagePath();
      packagesDirectory = this.getPackagesDirectory();
      if (this.isStoredInDotAtom(packagePath)) {
        return this.initPackage(packagePath, (function(_this) {
          return function() {
            return _this.installPackage(packagePath, callback);
          };
        })(this));
      } else {
        return this.initPackage(packagePath, (function(_this) {
          return function() {
            return _this.linkPackage(packagePath, function() {
              return _this.installPackage(packagePath, callback);
            });
          };
        })(this));
      }
    };

    MinimapPluginGeneratorView.prototype.runCommand = function(command, args, exit, options) {
      if (options == null) {
        options = {};
      }
      return new BufferedProcess({
        command: command,
        args: args,
        exit: exit,
        options: options
      });
    };

    return MinimapPluginGeneratorView;

  })(View);

}).call(this);

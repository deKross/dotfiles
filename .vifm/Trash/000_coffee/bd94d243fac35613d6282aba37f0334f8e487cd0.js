(function() {
  var Decoration, DecorationManagement, Emitter, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Mixin = require('mixto');

  path = require('path');

  Emitter = require('event-kit').Emitter;

  Decoration = require(path.join(atom.config.resourcePath, 'src', 'decoration'));

  module.exports = DecorationManagement = (function(_super) {
    __extends(DecorationManagement, _super);

    function DecorationManagement() {
      return DecorationManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DecorationManagement.prototype.initializeDecorations = function() {
      if (this.emitter == null) {
        this.emitter = new Emitter;
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.onDidAddDecoration = function(callback) {
      return this.emitter.on('did-add-decoration', callback);
    };

    DecorationManagement.prototype.onDidRemoveDecoration = function(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    };

    DecorationManagement.prototype.onDidChangeDecoration = function(callback) {
      return this.emitter.on('did-change-decoration', callback);
    };

    DecorationManagement.prototype.onDidUpdateDecoration = function(callback) {
      return this.emitter.on('did-update-decoration', callback);
    };

    DecorationManagement.prototype.decorationForId = function(id) {
      return this.decorationsById[id];
    };

    DecorationManagement.prototype.decorationsByTypesForRow = function() {
      var array, decoration, decorations, id, out, row, types, _i, _j, _len, _ref;
      row = arguments[0], types = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), decorations = arguments[_i++];
      out = [];
      for (id in decorations) {
        array = decorations[id];
        for (_j = 0, _len = array.length; _j < _len; _j++) {
          decoration = array[_j];
          if ((_ref = decoration.getProperties().type, __indexOf.call(types, _ref) >= 0) && decoration.getMarker().getScreenRange().intersectsRow(row)) {
            out.push(decoration);
          }
        }
      }
      return out;
    };

    DecorationManagement.prototype.decorationsForScreenRowRange = function(startScreenRow, endScreenRow) {
      var decorations, decorationsByMarkerId, marker, _i, _len, _ref;
      decorationsByMarkerId = {};
      _ref = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (decorations = this.decorationsByMarkerId[marker.id]) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }
      return decorationsByMarkerId;
    };

    DecorationManagement.prototype.decorateMarker = function(marker, decorationParams) {
      var cls, decoration, _base, _base1, _base2, _base3, _base4, _name, _name1, _name2, _name3, _name4;
      if (this.destroyed) {
        return;
      }
      if (marker == null) {
        return;
      }
      marker = this.getMarker(marker.id);
      if (marker == null) {
        return;
      }
      if ((decorationParams.scope == null) && (decorationParams["class"] != null)) {
        cls = decorationParams["class"].split(' ').join('.');
        decorationParams.scope = ".minimap ." + cls;
      }
      if ((_base = this.decorationMarkerDestroyedSubscriptions)[_name = marker.id] == null) {
        _base[_name] = marker.onDidDestroy((function(_this) {
          return function() {
            return _this.removeAllDecorationsForMarker(marker);
          };
        })(this));
      }
      if ((_base1 = this.decorationMarkerChangedSubscriptions)[_name1 = marker.id] == null) {
        _base1[_name1] = marker.onDidChange((function(_this) {
          return function(event) {
            var decoration, decorations, end, start, _i, _len, _ref;
            decorations = _this.decorationsByMarkerId[marker.id];
            if (decorations != null) {
              for (_i = 0, _len = decorations.length; _i < _len; _i++) {
                decoration = decorations[_i];
                _this.emitter.emit('did-change-decoration', {
                  marker: marker,
                  decoration: decoration,
                  event: event
                });
              }
            }
            start = event.oldTailScreenPosition;
            end = event.oldHeadScreenPosition;
            if (start.row > end.row) {
              _ref = [end, start], start = _ref[0], end = _ref[1];
            }
            return _this.emitRangeChanges({
              start: start,
              end: end,
              screenDelta: end - start
            });
          };
        })(this));
      }
      decoration = new Decoration(marker, this, decorationParams);
      if ((_base2 = this.decorationsByMarkerId)[_name2 = marker.id] == null) {
        _base2[_name2] = [];
      }
      this.decorationsByMarkerId[marker.id].push(decoration);
      this.decorationsById[decoration.id] = decoration;
      if ((_base3 = this.decorationUpdatedSubscriptions)[_name3 = decoration.id] == null) {
        _base3[_name3] = decoration.onDidChangeProperties((function(_this) {
          return function(event) {
            return _this.emitDecorationChanges(decoration);
          };
        })(this));
      }
      if ((_base4 = this.decorationDestroyedSubscriptions)[_name4 = decoration.id] == null) {
        _base4[_name4] = decoration.onDidDestroy((function(_this) {
          return function(event) {
            return _this.removeDecoration(decoration);
          };
        })(this));
      }
      this.emitDecorationChanges(decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });
      return decoration;
    };

    DecorationManagement.prototype.emitDecorationChanges = function(decoration) {
      var range;
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.emitRangeChanges(range);
    };

    DecorationManagement.prototype.emitRangeChanges = function(range) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, screenDelta, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      if (isNaN(screenDelta)) {
        screenDelta = 0;
      }
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.emitChanges(changeEvent);
    };

    DecorationManagement.prototype.removeDecoration = function(decoration) {
      var decorations, index, marker;
      if (decoration == null) {
        return;
      }
      marker = decoration.marker;
      if (!(decorations = this.decorationsByMarkerId[marker.id])) {
        return;
      }
      this.emitDecorationChanges(decoration);
      this.decorationUpdatedSubscriptions[decoration.id].dispose();
      this.decorationDestroyedSubscriptions[decoration.id].dispose();
      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];
      index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);
        delete this.decorationsById[decoration.id];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        if (decorations.length === 0) {
          return this.removedAllMarkerDecorations(marker);
        }
      }
    };

    DecorationManagement.prototype.removeAllDecorationsForMarker = function(marker) {
      var decoration, decorations, _i, _len, _ref;
      if (marker == null) {
        return;
      }
      decorations = (_ref = this.decorationsByMarkerId[marker.id]) != null ? _ref.slice() : void 0;
      if (!decorations) {
        return;
      }
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        this.emitDecorationChanges(decoration);
      }
      return this.removedAllMarkerDecorations(marker);
    };

    DecorationManagement.prototype.removedAllMarkerDecorations = function(marker) {
      if (marker == null) {
        return;
      }
      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();
      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      return delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    };

    DecorationManagement.prototype.removeAllDecorations = function() {
      var decoration, id, sub, _ref, _ref1, _ref2, _ref3, _ref4;
      _ref = this.decorationMarkerChangedSubscriptions;
      for (id in _ref) {
        sub = _ref[id];
        sub.dispose();
      }
      _ref1 = this.decorationMarkerDestroyedSubscriptions;
      for (id in _ref1) {
        sub = _ref1[id];
        sub.dispose();
      }
      _ref2 = this.decorationUpdatedSubscriptions;
      for (id in _ref2) {
        sub = _ref2[id];
        sub.dispose();
      }
      _ref3 = this.decorationDestroyedSubscriptions;
      for (id in _ref3) {
        sub = _ref3[id];
        sub.dispose();
      }
      _ref4 = this.decorationsById;
      for (id in _ref4) {
        decoration = _ref4[id];
        decoration.destroy();
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.emitter.emit('did-update-decoration', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);

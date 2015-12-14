(function() {
  var CompositeDisposable, Disposable, apply, disposables, style;

  CompositeDisposable = require('atom').CompositeDisposable;

  Disposable = require('atom').Disposable;

  style = null;

  disposables = null;

  module.exports = apply = function() {
    var createCSSOption, dispose, setupStylesheet, toRGBAString, updateCursorStyles;
    Promise.resolve(atom.packages.isPackageLoaded('cursor-blink-interval') && atom.packages.activatePackage('cursor-blink-interval')).then(function() {
      disposables = new CompositeDisposable(setupStylesheet(), atom.config.observe('glowing-cursor', updateCursorStyles));
    })["catch"](function(error) {
      console.error(error.message);
    });
    dispose = function() {
      disposables.dispose();
      return disposables = null;
    };
    toRGBAString = function(color) {
      if (typeof color === 'string') {
        return color;
      }
      if (typeof color.toRGBAString === 'function') {
        return color.toRGBAString();
      }
      return "rgba(" + color.red + ", " + color.green + ", " + color.blue + ", " + color.alpha + ")";
    };
    setupStylesheet = function() {
      style = document.createElement('style');
      style.type = 'text/css';
      document.querySelector('head atom-styles').appendChild(style);
      return new Disposable(function() {
        style.parentNode.removeChild(style);
        style = null;
      });
    };
    updateCursorStyles = function() {
      var cursorRule, cursorWidth, glowColor, glowDistance, innerColor, pulseOffRule, pulseOnRule, transitionDuration;
      style.innerHTML = '';
      glowColor = toRGBAString(atom.config.get('glowing-cursor.glowColor'));
      innerColor = toRGBAString(atom.config.get('glowing-cursor.innerColor'));
      cursorWidth = atom.config.get('glowing-cursor.cursorWidth');
      transitionDuration = atom.config.get('glowing-cursor.transitionDuration');
      glowDistance = atom.config.get('glowing-cursor.glowDistance');
      pulseOnRule = createCSSOption("atom-text-editor::shadow .cursors .cursor", {
        transition: "opacity ease-in-out",
        "transition-duration": "" + transitionDuration + "ms",
        opacity: 1,
        "background-color": "" + innerColor
      });
      pulseOffRule = createCSSOption("atom-text-editor::shadow .cursors.blink-off .cursor", {
        opacity: 0,
        visibility: "visible !important"
      });
      cursorRule = createCSSOption("atom-text-editor::shadow .cursors .cursor", {
        width: "" + cursorWidth + "px !important",
        "box-shadow": "0px 0px " + glowDistance + "px 0px " + glowColor
      });
      return style.innerHTML = pulseOnRule + '\n' + pulseOffRule + '\n' + cursorRule;
    };
    return createCSSOption = function(selector, properties) {
      var key, output;
      output = "" + selector + " {\n";
      for (key in properties) {
        output += "\t" + key + ": " + properties[key] + ";\n";
      }
      output += "}";
      return output;
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZ2xvd2luZy1jdXJzb3IvbGliL2dsb3dpbmctY3Vyc29yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSwwREFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBREQsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxJQUhSLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsSUFKZCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDSSxLQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sUUFBQSwyRUFBQTtBQUFBLElBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHVCQUE5QixDQUFBLElBQTJELElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4Qix1QkFBOUIsQ0FBM0UsQ0FBa0ksQ0FBQyxJQUFuSSxDQUF3SSxTQUFBLEdBQUE7QUFDdEksTUFBQSxXQUFBLEdBQWtCLElBQUEsbUJBQUEsQ0FDaEIsZUFBQSxDQUFBLENBRGdCLEVBRWhCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixnQkFBcEIsRUFBc0Msa0JBQXRDLENBRmdCLENBQWxCLENBRHNJO0lBQUEsQ0FBeEksQ0FNQyxDQUFDLE9BQUQsQ0FORCxDQU1RLFNBQUMsS0FBRCxHQUFBO0FBQ04sTUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEtBQUssQ0FBQyxPQUFwQixDQUFBLENBRE07SUFBQSxDQU5SLENBQUEsQ0FBQTtBQUFBLElBVUEsT0FBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsV0FBVyxDQUFDLE9B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

//# sourceURL=/C:/Users/soviet/.atom/packages/glowing-cursor/lib/glowing-cursor.coffee

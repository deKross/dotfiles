(function() {
  var CompositeDisposable, OneTab;

  CompositeDisposable = require('atom').CompositeDisposable;

  OneTab = (function() {
    function OneTab() {}

    OneTab.prototype.activate = function() {
      return atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          _this.subscriptions = new CompositeDisposable;
          return _this.subscriptions.add(atom.workspace.observePanes(function(pane) {
            return _this.initPane(pane);
          }));
        };
      })(this));
    };

    OneTab.prototype.deactivate = function() {
      return this.subscriptions.dispose();
    };

    OneTab.prototype.initPane = function(pane) {
      var subscription;
      subscription = new CompositeDisposable;
      subscription.add(pane.onDidDestroy(function() {
        return subscription.dispose();
      }));
      subscription.add(pane.onDidAddItem((function(_this) {
        return function() {
          return _this.updateTabBarVisibility(pane);
        };
      })(this)));
      subscription.add(pane.onDidRemoveItem((function(_this) {
        return function() {
          return _this.updateTabBarVisibility(pane);
        };
      })(this)));
      return this.updateTabBarVisibility(pane);
    };

    OneTab.prototype.updateTabBarVisibility = function(pane) {
      var paneView, tabView;
      paneView = atom.views.getView(pane);
      tabView = paneView.querySelector('.tab-bar');
      if (pane.getItems().length === 1) {
        return tabView.setAttribute('data-one-tab', true);
      } else {
        return tabView.removeAttribute('data-one-tab');
      }
    };

    return OneTab;

  })();

  module.exports = new OneTab();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvb25lLXRhYi9saWIvb25lLXRhYi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVNO3dCQUNGOztBQUFBLHFCQUFBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUFkLENBQTJDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkMsVUFBQSxLQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7aUJBQ0EsS0FBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixTQUFDLElBQUQsR0FBQTttQkFDM0MsS0FBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBRDJDO1VBQUEsQ0FBNUIsQ0FBbkIsRUFGdUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQyxFQURNO0lBQUEsQ0FBVixDQUFBOztBQUFBLHFCQU1BLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQURRO0lBQUEsQ0FOWixDQUFBOztBQUFBLHFCQVNBLFFBQUEsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNOLFVBQUEsWUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQUFBO0FBQUEsTUFDQSxZQUFZLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsWUFBTCxDQUFrQixTQUFBLEdBQUE7ZUFDL0IsWUFBWSxDQUFDLE9BQWIsQ0FBQSxFQUQrQjtNQUFBLENBQWxCLENBQWpCLENBREEsQ0FBQTtBQUFBLE1BSUEsWUFBWSxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDL0IsS0FBQyxDQUFBLHNCQUFELENBQXdCLElBQXhCLEVBRCtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEIsQ0FBakIsQ0FKQSxDQUFBO0FBQUEsTUFPQSxZQUFZLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsZUFBTCxDQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNsQyxLQUFDLENBQUEsc0JBQUQsQ0FBd0IsSUFBeEIsRUFEa0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQixDQUFqQixDQVBBLENBQUE7YUFVQSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsSUFBeEIsRUFYTTtJQUFBLENBVFYsQ0FBQTs7QUFBQSxxQkFzQkEsc0JBQUEsR0FBd0IsU0FBQyxJQUFELEdBQUE7QUFDcEIsVUFBQSxpQkFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFuQixDQUFYLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QixDQURWLENBQUE7QUFHQSxNQUFBLElBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBaEIsS0FBMEIsQ0FBN0I7ZUFDSSxPQUFPLENBQUMsWUFBUixDQUFxQixjQUFyQixFQUFxQyxJQUFyQyxFQURKO09BQUEsTUFBQTtlQUdJLE9BQU8sQ0FBQyxlQUFSLENBQXdCLGNBQXhCLEVBSEo7T0FKb0I7SUFBQSxDQXRCeEIsQ0FBQTs7a0JBQUE7O01BSEosQ0FBQTs7QUFBQSxFQWtDQSxNQUFNLENBQUMsT0FBUCxHQUFxQixJQUFBLE1BQUEsQ0FBQSxDQWxDckIsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/soviet/.atom/packages/one-tab/lib/one-tab.coffee

(function() {
  module.exports = {
    config: {
      cursorWidth: {
        title: 'Cursor Width',
        description: 'The width of your cursor',
        type: 'integer',
        "default": 1
      },
      innerColor: {
        title: 'Cursor Primary Color',
        description: 'The pirmary color inside the cursor.',
        type: 'color',
        "default": 'rgba(97,210,255,1.0)'
      },
      glowDistance: {
        title: 'Glow Width',
        description: 'The distance the cursor\'s glow should extend on either side',
        type: 'integer',
        "default": 6
      },
      glowColor: {
        title: 'Glow Color',
        description: 'Change the glow color of the selector.',
        type: 'color',
        "default": 'rgba(75,213,255,1.0)'
      },
      transitionDuration: {
        title: 'Transition duration',
        description: 'The duration of the phase transition animation',
        type: 'integer',
        "default": 500
      }
    },
    activate: function(state) {
      var glowingCursor;
      glowingCursor = require('./glowing-cursor');
      return glowingCursor.apply();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZ2xvd2luZy1jdXJzb3IvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsMEJBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsQ0FIVDtPQURGO0FBQUEsTUFLQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHNDQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLHNCQUhUO09BTkY7QUFBQSxNQVVBLFlBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLFlBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw4REFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxDQUhUO09BWEY7QUFBQSxNQWVBLFNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLFlBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx3Q0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxzQkFIVDtPQWhCRjtBQUFBLE1Bb0JBLGtCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLGdEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEdBSFQ7T0FyQkY7S0FERjtBQUFBLElBNEJBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsYUFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FBaEIsQ0FBQTthQUNBLGFBQWEsQ0FBQyxLQUFkLENBQUEsRUFGUTtJQUFBLENBNUJWO0dBRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/soviet/.atom/packages/glowing-cursor/lib/config.coffee

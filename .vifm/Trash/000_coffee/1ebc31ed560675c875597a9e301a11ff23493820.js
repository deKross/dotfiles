(function() {
  var neonCursor;

  module.exports = neonCursor = {
    config: {
      cursorType: {
        title: 'Cursor type',
        description: 'Change cursor type between a box and a bar cursor',
        type: 'string',
        "default": 'bar',
        "enum": ['bar', 'box']
      }
    },
    activate: function() {
      atom.workspace.observeTextEditors(this.init);
      return atom.config.onDidChange('neon-cursor.cursorType', neonCursor.setCursorType);
    },
    setCursorType: function() {
      var classList, cursorType, textEditor, textEditorView, _i, _len, _ref, _results;
      cursorType = atom.config.get('neon-cursor.cursorType');
      _ref = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        textEditor = _ref[_i];
        textEditorView = atom.views.getView(textEditor);
        if (textEditorView.shadowRoot) {
          classList = textEditorView.shadowRoot.querySelector('.cursors').classList;
        }
        if (cursorType === 'bar') {
          _results.push(classList.add('neon-cursor-bar'));
        } else {
          _results.push(classList.remove('neon-cursor-bar'));
        }
      }
      return _results;
    },
    init: function(textEditor) {
      return neonCursor.setCursorType();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvbmVvbi1jdXJzb3IvbGliL25lb24tY3Vyc29yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQSxHQUNoQjtBQUFBLElBQUEsTUFBQSxFQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsbURBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQ0wsS0FESyxFQUVMLEtBRkssQ0FKTjtPQUREO0tBREQ7QUFBQSxJQVdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsSUFBQyxDQUFBLElBQW5DLENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qix3QkFBeEIsRUFBa0QsVUFBVSxDQUFDLGFBQTdELEVBRlM7SUFBQSxDQVhWO0FBQUEsSUFlQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2QsVUFBQSwyRUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FBYixDQUFBO0FBRUE7QUFBQTtXQUFBLDJDQUFBOzhCQUFBO0FBQ0MsUUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixVQUFuQixDQUFqQixDQUFBO0FBRUEsUUFBQSxJQUFHLGNBQWMsQ0FBQyxVQUFsQjtBQUNDLFVBQUEsU0FBQSxHQUFZLGNBQWMsQ0FBQyxVQUFVLENBQUMsYUFBMUIsQ0FBd0MsVUFBeEMsQ0FBbUQsQ0FBQyxTQUFoRSxDQUREO1NBRkE7QUFLQSxRQUFBLElBQUcsVUFBQSxLQUFjLEtBQWpCO3dCQUNDLFNBQVMsQ0FBQyxHQUFWLENBQWMsaUJBQWQsR0FERDtTQUFBLE1BQUE7d0JBR0MsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsaUJBQWpCLEdBSEQ7U0FORDtBQUFBO3NCQUhjO0lBQUEsQ0FmZjtBQUFBLElBNkJBLElBQUEsRUFBTSxTQUFDLFVBQUQsR0FBQTthQUNMLFVBQVUsQ0FBQyxhQUFYLENBQUEsRUFESztJQUFBLENBN0JOO0dBREQsQ0FBQTtBQUFBIgp9

//# sourceURL=/C:/Users/soviet/.atom/packages/neon-cursor/lib/neon-cursor.coffee

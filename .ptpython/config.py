from __future__ import unicode_literals
from prompt_toolkit.keys import Keys
from pygments.token import Token
from ptpython.layout import CompletionVisualisation


def configure(repl):
    repl.use_code_colorscheme('monokai')
    repl.enable_auto_suggest = True
    repl.confirm_exit = False
    repl.completion_visualisation = CompletionVisualisation.MULTI_COLUMN
    repl.highlight_matching_parenthesis = True
    repl.complete_while_typing = False
    repl.enable_history_search = True


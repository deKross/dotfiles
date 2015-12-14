source ~/antigen/antigen.zsh

[[ $TMUX = "" ]] && export TERM="xterm-256color"
export PATH=~/Sources/tmuxifier/bin:~/.gem/ruby/2.0.0/bin:~/.local/bin:$PATH
export DISABLE_VENV_CD=1

# Load the oh-my-zsh's library.
antigen use oh-my-zsh

# Bundles from the default repo (robbyrussell's oh-my-zsh).
antigen bundles <<EOBUNDLES
    zsh-users/zsh-syntax-highlighting
    git
    pip
    history-substring-search
    common-aliases
    git-extras
    colored-man
    cp
    extract
    fasd
    jsontools
    virtualenvwrapper
    sublime
    vagrant
EOBUNDLES

antigen bundle archlinux
#if [[ $(uname -n) == 'ZX-Spectrum' ]]; then
#    antigen bundle archlinux
#
#    eval "$(tmuxifier init -)"
#    export TMUXIFIER_LAYOUT_PATH="$HOME/.tmux-layouts"
#    alias soviet='tmuxifier load-session soviet'
#else
#    antigen bundle debian
#fi

# Load the theme.
# antigen theme sorin
# Tell antigen that you're done.
antigen apply

setopt autocd
setopt auto_pushd
setopt chase_links
setopt pushd_ignore_dups

setopt always_to_end
setopt menu_complete

setopt nomatch
setopt numeric_glob_sort

setopt hist_ignore_all_dups
setopt hist_ignore_space
setopt hist_reduce_blanks
setopt hist_verify
setopt no_share_history

#setopt correct_all
setopt no_flow_control
setopt interactive_comments
#setopt print_exit_value
stty -ixon

setopt auto_resume

setopt transient_rprompt

setopt c_bases

KEYBOARD_HACK=\\

fpath=(
    ~/.zshfuncs
    "${fpath[@]}"
)

autoload -Uz ipython mkcd python fshow fda

alias v='f -e vim'
alias o='a -e xdg-open'

export _FASD_FUZZY=42
export WORKON_HOME=~/virtualenvs
export EDITOR="vim"
export ZLE_RPROMPT_INDENT=1

alias cls="reset && tmux clear-history"
alias ncal='ncal -MC'
alias tmux='tmux -2'
alias view='vim -R'
alias django-coverage="coverage run --source='.' manage.py test"
#alias ack='ack-grep'
alias mtr='mtr -t'
alias cbo='xclip -o -selection clipboard'
alias cbi='xclip -i -selection clipboard'

source ~/shell_prompt.sh

export PYTHONDONTWRITEBYTECODE=1

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

export FZF_DEFAULT_OPTS='
    --bind ctrl-f:page-down,ctrl-b:page-up
    --color fg:252,bg:-1,hl:67,fg+:252,bg+:-1,hl+:81
    --color info:144,prompt:161,spinner:135,pointer:135,marker:118
'

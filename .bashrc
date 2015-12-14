# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

export PATH=~/Sources/tmuxifier/bin:~/.gem/ruby/2.0.0/bin:~/.local/bin:$PATH

# INFINALITY FONT RENDERING CONFIG
. /etc/infinality-settings.sh

# If not running interactively, don't do anything
[ -z "$PS1" ] && return

# for tmux: export 256color
[ -n "$TMUX" ] && export TERM=screen-256color

[ "$TERM" == "xterm" ] && export TERM="xterm-256color"

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
shopt -s globstar

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# some more ls aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if [ -f /etc/bash_completion ] && ! shopt -oq posix; then
    . /etc/bash_completion
fi

#if [ "$TERM" == "fbterm" ]; then
    #screenfetch
#fi

for f in ~/.bash/*; do source $f; done
#eval "$(fasd --init auto)"
#eval "$(tmuxifier init -)"

shopt -s autocd
shopt -s cdspell
shopt -s no_empty_cmd_completion
shopt -s histverify

stty werase undef
bind '\C-w:unix-filename-rubout'

export EDITOR="vim"
# export PAGER="vimpager"
export TMUXIFIER_LAYOUT_PATH="$HOME/.tmux-layouts"
export WORKON_HOME=~/virtualenvs
source /usr/local/bin/virtualenvwrapper.sh

alias cls="echo -ne '\033c'"
alias ncal='ncal -MC'
alias tmux='tmux -2'
alias soviet='tmuxifier load-session soviet'
alias view='vim -R'
alias django-coverage="coverage run --source='.' manage.py test"
alias ack=ack-grep
#alias apt-search="apt-cache -n search"
#alias cpufreq="cpufreq-info | grep -m 1 --color=never \"current CPU frequency\""
#alias powersave="sudo cpufreq-set -g powersave && cpufreq"
#alias performance="sudo cpufreq-set -g performance && cpufreq"
#alias ctrack='mpc --format "[[%artist%  - ]%title%]" current'
#while sleep 1 ; do echo -ne '\033]2;'`date +'%A %B %d %T'`'\007'; done &

#eval `ssh-agent`

source ~/.custom-ps1
. /usr/share/autojump/autojump.sh
trap 'echo -ne "\e[0m"' DEBUG

[ -f ~/.fzf.bash ] && source ~/.fzf.bash

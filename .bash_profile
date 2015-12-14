#if [[ "$(tty)" =~ /dev/tty[1-4] ]]; then
#    exec ~/runfbterm ~/Pictures/terminal-backs/`basename $(tty)`.jpg
#elif [ "$(tty)" == "/dev/tty4" ]; then
#    exec fbterm
#elif [[ "$(tty)" =~ /dev/tty[5-7] ]]; then
#    export TERM="linux"
#fi
#
#
. ~/.bashrc

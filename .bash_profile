if [[ "$(tty)" =~ /dev/tty[2-3] ]]; then
    exec ~/runfbterm ~/terminal.png
#elif [ "$(tty)" == "/dev/tty4" ]; then
#    exec fbterm
#elif [[ "$(tty)" =~ /dev/tty[5-7] ]]; then
#    export TERM="linux"
fi
#
#
. ~/.bashrc

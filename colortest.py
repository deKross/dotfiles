#!/usr/bin/env python
from shutil import get_terminal_size

fg = '\033[38;5;'
bg = '\033[48;5;'

field_width = 13
width = get_terminal_size().columns // field_width

for i in range(0, 256):
    n = str(i)
    n2 = "%3d" % i
    fgstr = fg + n + 'm' + n2
    bgstr = bg + n + 'm' 'XXXXX'
    print(fgstr, bgstr, '\033[0m', ' ' * 3, end='')
    if i%width==0:
        print('')
print('')

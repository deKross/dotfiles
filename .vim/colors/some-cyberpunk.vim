set background=dark
hi clear
if exists("syntax_on")
	syntax reset
endif
set t_Co=256
let colors_name = "some-cyberpunk"

hi Normal ctermfg=none ctermbg=none
hi Comment ctermfg=95
hi Constant ctermfg=214
hi Identifier ctermfg=255 cterm=none
hi Function ctermfg=255 cterm=bold
hi Statement ctermfg=249
hi Conditional ctermfg=246 cterm=bold
hi link Repeat Conditional
hi link Keyword Conditional
hi link Exception Conditional
hi PreProc ctermfg=220
hi Type ctermfg=214
hi Special ctermfg=221

hi VertSplit ctermfg=240 cterm=none
hi Directory ctermfg=220
hi Question ctermfg=220
hi MoreMsg ctermfg=220
hi ModeMsg ctermfg=237
hi LineNr ctermfg=245
hi CursorLineNr ctermfg=250
hi NonText ctermfg=239
hi Search ctermfg=208 ctermbg=none cterm=underline
hi IncSearch ctermfg=208 ctermbg=none cterm=underline
hi Folded ctermbg=none ctermfg=245
hi TabLineFill cterm=none ctermfg=none
hi TabLine cterm=none ctermbg=none ctermfg=240
hi TabLineSel cterm=none ctermfg=248
hi TabLineSeparator ctermfg=238
hi StatusLine ctermfg=234

hi FoldColumn ctermbg=none
hi DiffChange ctermbg=238
hi DiffText ctermbg=242

hi pythonBuiltinObj ctermfg=220 ctermbg=NONE cterm=bold
hi pythonSelf ctermfg=220
hi link pythonStatement Keyword
hi link pythonRepeat Repeat
hi link pythonConditional Conditional
hi link pythonPreCondit PreCondit
hi link pythonException Exception
hi link pythonOperator Operator
hi link pythonDottedName pythonDecorator
hi pythonSpaceError ctermfg=none ctermbg=none cterm=none term=none

highlight airline_b_to_airline_c ctermbg=none
highlight airline_c ctermbg=none
highlight airline_c_to_airline_x ctermbg=none

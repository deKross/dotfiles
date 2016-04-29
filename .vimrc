if has('vim_starting')
    set nocompatible
    set runtimepath+=~/.vim/bundle/neobundle.vim/
endif

call neobundle#begin(expand('~/.vim/bundle/'))

NeoBundleFetch 'Shougo/neobundle.vim'

NeoBundle 'vim-scripts/IndexedSearch'
NeoBundle 'dwm.vim'
NeoBundle 'scrooloose/nerdcommenter'
NeoBundle 'restore_view.vim'
NeoBundle 'Shougo/vimproc.vim', {
    \ 'build' : {
    \     'windows' : 'make -f make_mingw32.mak',
    \     'cygwin' : 'make -f make_cygwin.mak',
    \     'mac' : 'make -f make_mac.mak',
    \     'unix' : 'make -f make_unix.mak',
    \    },
\ }
NeoBundle 'Shougo/unite.vim'
NeoBundle 'Shougo/unite-help'
NeoBundle 'tacroe/unite-mark'
NeoBundle 'Shougo/unite-outline'
NeoBundle 'Shougo/unite-session'
NeoBundle 'Shougo/vimfiler.vim'
NeoBundle 'Shougo/vinarise.vim'
NeoBundle 'tpope/vim-repeat'
NeoBundle 'thinca/vim-unite-history'
NeoBundle 'tpope/vim-rsi'
NeoBundle 'majutsushi/tagbar'
NeoBundle 'bling/vim-airline'
"NeoBundle 'bling/vim-bufferline'
NeoBundle 'tpope/vim-fugitive'
NeoBundle 'edkolev/promptline.vim'
NeoBundle 'davidhalter/jedi-vim'
"NeoBundle 'Valloric/YouCompleteMe'
NeoBundle 'vifm/vifm.vim'
NeoBundle 'adimit/prolog.vim'
NeoBundle 'jeetsukumaran/vim-buffergator'
NeoBundle 'junegunn/goyo.vim'
NeoBundle 'junegunn/vim-peekaboo'
NeoBundle 'junegunn/vim-pseudocl'
NeoBundle 'junegunn/vim-oblique'
NeoBundle 'airblade/vim-gitgutter'
NeoBundle 'sjl/gundo.vim'
NeoBundle 'ctrlpvim/ctrlp.vim'
NeoBundle 'jmcantrell/vim-virtualenv'
NeoBundle 'mhinz/vim-startify'
NeoBundle 'DirDiff.vim'
NeoBundle 'Tail-Bundle'
NeoBundle 'hdima/python-syntax'
NeoBundle 'ervandew/supertab'

call neobundle#end()
"set rtp+=~/.vim/bundle/vundle/
"set rtp+=/usr/local/lib/python2.7/dist-packages/Powerline-beta-py2.7.egg/powerline/bindings/vim
"call vundle#rc()

"Bundle 'gmarik/vundle'
"Bundle 'mbbill/undotree'
"Bundle 'scrooloose/nerdtree'
"Bundle 'scrooloose/nerdcommenter'
"Bundle 'scrooloose/syntastic'
"Bundle 'tpope/vim-fugitive'
"Bundle 'tpope/vim-surround'
"Bundle 'tpope/vim-repeat'
"Bundle 'tpope/vim-speeddating'
"Bundle 'tpope/vim-abolish'
"Bundle 'tpope/vim-rsi'
"Bundle 'tpope/vim-eunuch'
"Bundle 'tpope/vim-afterimage'
"Bundle 'tpope/vim-endwise'
"Bundle 'tpope/vim-unimpaired'
"Bundle 'shougo/neocomplcache'
"Bundle 'majutsushi/tagbar'
"Bundle 'chrisbra/NrrwRgn'
"Bundle 'godlygeek/tabular'
"Bundle 'jeetsukumaran/vim-buffergator'
"Bundle 'Lokaltog/vim-easymotion'
"Bundle 'kien/rainbow_parentheses.vim'
""Bundle 'christoomey/vim-space'
"Bundle 'AndrewRadev/sideways.vim'
"Bundle 'ervandew/supertab'
"Bundle 'mutewinter/vim-css3-syntax'
"Bundle 'PotatoesMaster/i3-vim-syntax'
"Bundle 'mattn/zencoding-vim'
"Bundle 'spolu/dwm.vim'
"Bundle 'Shougo/unite.vim'
"Bundle 'SirVer/ultisnips'
"Bundle 'jpalardy/vim-slime'
"Bundle 'ap/vim-css-color'
"Bundle 'Townk/vim-autoclose'
"Bundle 'deKross/tmux.vim'
""Bundle 'klen/python-mode'
"Bundle 'jcf/vim-latex'
"Bundle 'scottmcginness/vim-jquery'
"Bundle 'IndexedSearch'
"Bundle 'matchit.zip'
"Bundle 'ZoomWin'
"Bundle 'YankRing.vim'
"Bundle 'dbext.vim'
"Bundle 'DirDiff.vim'
"Bundle 'python.vim'
"Bundle 'django.vim'
"Bundle 'restore_view.vim'
filetype plugin indent on

NeoBundleCheck

syntax on
"colorscheme some-cyberpunk
colorscheme janah

set cinwords+=class
set cinwords+=def
set cinwords+=try
set cinwords+=except
set cinwords+=elif

set ruler
set showcmd
set autoindent
set smartindent
set expandtab
set shiftround
set number
set relativenumber
set hlsearch
set incsearch
set ignorecase
set smartcase
set linebreak
set wrap
set magic

set scrolloff      =5
set winminheight   =0
set softtabstop    =4
set tabstop        =4
set shiftwidth     =4
set laststatus     =2
set foldlevelstart =99

set completeopt=preview
set rulerformat=%22(%5l,%-6(%c%V%)\ %P\ %{strftime('%R\')}%)
set grepprg=grep\ -nH\ $*
set viewoptions-=options
set fillchars=fold:\ ,vert:\│


if has("persistent_undo")
    set undodir=~/.vimtemp/undo
    set undofile
endif

set directory^=~/.vimtemp/swap//
set backupdir^=~/.vimtemp/backup//
set viewdir=~/.vimtemp/view//

let g:multi_cursor_next_key='<F1>'

let g:undotree_SetFocusWhenToggle = 1

let g:NERDTreeBookmarksFile = '~/.vimtemp/NERDTreeBookmarks'

let g:neocomplcache_enable_at_startup = 0
let g:neocomplcache_enable_smart_case = 1

let g:tagbar_autofocus = 1
let g:tagbar_width     = 42
let g:tagbar_sort      = 0
let g:tagbar_iconchars = ['▸', '▾']

let g:SuperTabDefaultCompletionType = "context"

let g:dwm_map_keys          = 0
let g:dwm_master_pane_width = "60%"

let g:UltiSnipsEditSplit           = "horizontal"
let g:UltiSnipsSnippetsDir         = "~/.vim/bundle/ultisnips/UltiSnips"

let g:UltiSnipsExpandTrigger       = "<Tab>"
let g:UltiSnipsListSnippets        = "<leader><s><l>"
let g:UltiSnipsJumpForwardTrigger  = "<Home>"
"let g:UltiSnipsJumpBackwardTrigger = <S-Home>

let g:unite_data_directory = '~/.vimtemp/unite'

let g:yankring_max_history        = 500
let g:yankring_min_element_length = 2
let g:yankring_history_dir        = '~/.vimtemp/yankring'
let g:yankring_history_file       = ''

let g:tex_flavor = 'latex'

let g:python_version_2 = 1
let g:python_highlight_space_errors = 0
let g:python_space_error_highlight = 0
let g:python_highlight_all = 0

let g:syntastic_python_checkers=[]

let g:pymode_folding              = 0
let g:pymode_lint                 = 0
let g:pymode_syntax_indent_errors = 0
let g:pymode_syntax_space_errors  = 0

let g:airline_theme = 'wombat'
let g:airline_powerline_fonts = 1
let g:airline_section_z = "%3p%% %{line('$')}%{g:airline_symbols.linenr}%#__accent_bold#%4l%#__restore__#:%3c"
"let g:airline_theme_patch_func = 'AirlineThemePatch'

function! AirlineThemePatch(palette)
    let a:palette.normal['airline_c'][3] = 'none'
endfunction

let g:airline#extensions#tabline#enabled = 1
let g:airline#extensions#tabline#formatter = 'unique_tail'
let g:airline#extensions#tabline#show_close_button = 0
let g:airline#extensions#tabline#tab_nr_type = 2
let g:airline#extensions#whitespace#enabled = 0
"let g:airline#extensions#bufferline#overwrite_variables = 0
"let g:bufferline_active_highlight = 'airline_c'

let g:vimfiler_as_default_explorer = 1

let g:promptline_theme = 'airline'
let g:promptline_preset = {
    \ 'a': [ promptline#slices#python_virtualenv() ],
    \ 'b': [ promptline#slices#cwd({'dir_limit': 1}) ],
    \ 'y': [ promptline#slices#vcs_branch() ],
    \ 'x': [ promptline#slices#git_status() ],
    \ 'warn': [ promptline#slices#last_exit_code() ]}

let g:rbpt_colorpairs = [
    \ ['brown'      , 'RoyalBlue3' ],
    \ ['Darkblue'   , 'SeaGreen3'  ],
    \ ['darkgray'   , 'DarkOrchid3'],
    \ ['darkgreen'  , 'firebrick3' ],
    \ ['darkcyan'   , 'RoyalBlue3' ],
    \ ['darkred'    , 'SeaGreen3'  ],
    \ ['130', 'DarkOrchid3'],
    \ ['185'      , 'firebrick3' ],
    \ ['136'       , 'RoyalBlue3' ],
    \ ['166'        , 'SeaGreen3'  ],
    \ ['178', 'DarkOrchid3'],
    \ ['227'   , 'firebrick3' ],
    \ ['226'  , 'RoyalBlue3' ],
    \ ['208'      , 'SeaGreen3'  ],
    \ ['214'      , 'DarkOrchid3'],
    \ ['220'       , 'firebrick3' ],
    \ ]
let g:rbpt_max            = 16
let g:rbpt_loadcmd_toggle = 0

let g:vimfiler_as_default_explorer = 1

let g:jedi#use_tabs_not_buffers = 1
let g:jedi#goto_command = "<leader>d"
let g:jedi#goto_assignments_command = "<leader>g"
let g:jedi#goto_definitions_command = ""
let g:jedi#documentation_command = "K"
let g:jedi#usages_command = "<leader>n"
let g:jedi#completions_command = "<C-Space>"
let g:jedi#rename_command = "<leader>r"

nnoremap <silent> <F2> :TagbarToggle<CR>
nnoremap <silent> <F3> :BuffergatorToggle<CR>
nnoremap <silent> <F4> :BuffergatorTabsOpen<CR>
nnoremap <silent> <F5> :YRShow<CR>
nnoremap <silent> <F6> :UndotreeToggle<CR>
nnoremap <silent> <F7> :VimFilerExplorer<CR>

nnoremap <Space> <PageDown>
nnoremap <C-PageDown> :update!<CR>

inoremap <expr><TAB>  pumvisible() ? "\<C-n>" : "\<TAB>"

nnoremap <c-j> :SidewaysLeft<cr>
nnoremap <c-k> :SidewaysRight<cr>

nnoremap <leader><C-J> <C-W>w
nnoremap <leader><C-K> <C-W>W
nnoremap <leader><C-,> <Plug>DWMRotateCounterclockwise
nnoremap <leader><C-.> <Plug>DWMRotateClockwise
nnoremap <leader><C-N> <Plug>DWMNew
nnoremap <leader><C-C> <Plug>DWMClose
nnoremap <leader><C-@> <Plug>DWMFocus
nnoremap <C-Space> <Plug>DWMFocus
nnoremap <leader><C-L> <Plug>DWMGrowMaster
nnoremap <leader><C-H> <Plug>DWMShrinkMaster
nnoremap o o<Esc>
nnoremap O O<Esc>
nnoremap <CR> a
nnoremap Q <Nop>

command Rmts %s/\s\+$//e

"au VimEnter * RainbowParenthesesToggle
"au Syntax * RainbowParenthesesLoadRound
"au Syntax * RainbowParenthesesLoadSquare
"au Syntax * RainbowParenthesesLoadBraces

autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
"autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags
autocmd FileType python setlocal completeopt-=preview
autocmd FileType python setlocal completeopt+=menu

"autocmd BufEnter * let &titlestring = ' ' . expand("%:t")
"set title

set langmap=ёйцукенгшщзхъфывапролджэячсмитьбюЁЙЦУКЕHГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ;`qwertyuiop[]asdfghjkl\\;'zxcvbnm\\,.~QWERTYUIOP{}ASDFGHJKL:\\"ZXCVBNM<>

nmap Ж :
" yank
nmap Н Y
nmap з p
nmap ф a
nmap щ o
nmap г u
nmap З P

if exists("+showtabline")
    function! MyTabLine()
        let s = ''
        let wn = ''
        let t = tabpagenr()
        let i = 1
        while i <= tabpagenr('$')
            let buflist = tabpagebuflist(i)
            let winnr = tabpagewinnr(i)
            let s .= '%' . i . 'T'
            let s .= (i == t ? '%1*' : '%2*')
            let s .= ''
            let wn = tabpagewinnr(i,'$')

            let s .= (i== t ? '%#TabNumSel#' : '%#TabNum#')
            let s .= i
            if tabpagewinnr(i,'$') > 1
                let s .= '.'
                let s .= (i== t ? '%#TabWinNumSel#' : '%#TabWinNum#')
                let s .= (tabpagewinnr(i,'$') > 1 ? wn : '')
            end

            let s .= '%#TabLineSeparator#' . ':' . (i==t ? '%#TabWinNumSel#' : '%#TabWinNum#') . '%*'
            let s .= (i == t ? '%#TabLineSel#' : '%#TabLine#')
            let bufnr = buflist[winnr - 1]
            let file = bufname(bufnr)
            let buftype = getbufvar(bufnr, 'buftype')
            if buftype == 'nofile'
                if file =~ '\/.'
                    let file = substitute(file, '.*\/\ze.', '', '')
                endif
            else
                let file = fnamemodify(file, ':p:t')
            endif
            if file == ''
                let file = '[No Name]'
            endif
            let s .= file
            let s .= (i == t ? '%m' : '')
            if i < tabpagenr('$')
                let s .= '%#TabLineSeparator#' . '╵'
            endif
            let i = i + 1
        endwhile
        let s .= '%T%#TabLineFill#%='
        return s
    endfunction
    set tabline=%!MyTabLine()
endif

" If you are using a console version of Vim, or dealing
" with a file that changes externally (e.g. a web server log)
" then Vim does not always check to see if the file has been changed.
" The GUI version of Vim will check more often (for example on Focus change),
" and prompt you if you want to reload the file.
"
" There can be cases where you can be working away, and Vim does not
" realize the file has changed. This command will force Vim to check
" more often.
"
" Calling this command sets up autocommands that check to see if the
" current buffer has been modified outside of vim (using checktime)
" and, if it has, reload it for you.
"
" This check is done whenever any of the following events are triggered:
" * BufEnter
" * CursorMoved
" * CursorMovedI
" * CursorHold
" * CursorHoldI
"
" In other words, this check occurs whenever you enter a buffer, move the cursor,
" or just wait without doing anything for 'updatetime' milliseconds.
"
" Normally it will ask you if you want to load the file, even if you haven't made
" any changes in vim. This can get annoying, however, if you frequently need to reload
" the file, so if you would rather have it to reload the buffer *without*
" prompting you, add a bang (!) after the command (WatchForChanges!).
" This will set the autoread option for that buffer in addition to setting up the
" autocommands.
"
" If you want to turn *off* watching for the buffer, just call the command again while
" in the same buffer. Each time you call the command it will toggle between on and off.
"
" WatchForChanges sets autocommands that are triggered while in *any* buffer.
" If you want vim to only check for changes to that buffer while editing the buffer
" that is being watched, use WatchForChangesWhileInThisBuffer instead.
"
command! -bang WatchForChanges                  :call WatchForChanges(@%,  {'toggle': 1, 'autoread': <bang>0})
command! -bang WatchForChangesWhileInThisBuffer :call WatchForChanges(@%,  {'toggle': 1, 'autoread': <bang>0, 'while_in_this_buffer_only': 1})
command! -bang WatchForChangesAllFile           :call WatchForChanges('*', {'toggle': 1, 'autoread': <bang>0})
" WatchForChanges function
"
" This is used by the WatchForChanges* commands, but it can also be
" useful to call this from scripts. For example, if your script executes a
" long-running process, you can have your script run that long-running process
" in the background so that you can continue editing other files, redirects its
" output to a file, and open the file in another buffer that keeps reloading itself
" as more output from the long-running command becomes available.
"
" Arguments:
" * bufname: The name of the buffer/file to watch for changes.
"     Use '*' to watch all files.
" * options (optional): A Dict object with any of the following keys:
"   * autoread: If set to 1, causes autoread option to be turned on for the buffer in
"     addition to setting up the autocommands.
"   * toggle: If set to 1, causes this behavior to toggle between on and off.
"     Mostly useful for mappings and commands. In scripts, you probably want to
"     explicitly enable or disable it.
"   * disable: If set to 1, turns off this behavior (removes the autocommand group).
"   * while_in_this_buffer_only: If set to 0 (default), the events will be triggered no matter which
"     buffer you are editing. (Only the specified buffer will be checked for changes,
"     though, still.) If set to 1, the events will only be triggered while
"     editing the specified buffer.
"   * more_events: If set to 1 (the default), creates autocommands for the events
"     listed above. Set to 0 to not create autocommands for CursorMoved, CursorMovedI,
"     (Presumably, having too much going on for those events could slow things down,
"     since they are triggered so frequently...)
function! WatchForChanges(bufname, ...)
  " Figure out which options are in effect
  if a:bufname == '*'
    let id = 'WatchForChanges'.'AnyBuffer'
    " If you try to do checktime *, you'll get E93: More than one match for * is given
    let bufspec = ''
  else
    if bufnr(a:bufname) == -1
      echoerr "Buffer " . a:bufname . " doesn't exist"
      return
    end
    let id = 'WatchForChanges'.bufnr(a:bufname)
    let bufspec = a:bufname
  end
  if len(a:000) == 0
    let options = {}
  else
    if type(a:1) == type({})
      let options = a:1
    else
      echoerr "Argument must be a Dict"
    end
  end
  let autoread    = has_key(options, 'autoread')    ? options['autoread']    : 0
  let toggle      = has_key(options, 'toggle')      ? options['toggle']      : 0
  let disable     = has_key(options, 'disable')     ? options['disable']     : 0
  let more_events = has_key(options, 'more_events') ? options['more_events'] : 1
  let while_in_this_buffer_only = has_key(options, 'while_in_this_buffer_only') ? options['while_in_this_buffer_only'] : 0
  if while_in_this_buffer_only
    let event_bufspec = a:bufname
  else
    let event_bufspec = '*'
  end
  let reg_saved = @"
  "let autoread_saved = &autoread
  let msg = "\n"
  " Check to see if the autocommand already exists
  redir @"
    silent! exec 'au '.id
  redir END
  let l:defined = (@" !~ 'E216: No such group or event:')
  " If not yet defined...
  if !l:defined
    if l:autoread
      let msg = msg . 'Autoread enabled - '
      if a:bufname == '*'
        set autoread
      else
        setlocal autoread
      end
    end
    silent! exec 'augroup '.id
      if a:bufname != '*'
        "exec "au BufDelete    ".a:bufname . " :silent! au! ".id . " | silent! augroup! ".id
        "exec "au BufDelete    ".a:bufname . " :echomsg 'Removing autocommands for ".id."' | au! ".id . " | augroup! ".id
        exec "au BufDelete    ".a:bufname . " execute 'au! ".id."' | execute 'augroup! ".id."'"
      end
        exec "au BufEnter     ".event_bufspec . " :checktime ".bufspec
        exec "au CursorHold   ".event_bufspec . " :checktime ".bufspec
        exec "au CursorHoldI  ".event_bufspec . " :checktime ".bufspec
      " The following events might slow things down so we provide a way to disable them...
      " vim docs warn:
      "   Careful: Don't do anything that the user does
      "   not expect or that is slow.
      if more_events
        exec "au CursorMoved  ".event_bufspec . " :checktime ".bufspec
        exec "au CursorMovedI ".event_bufspec . " :checktime ".bufspec
      end
    augroup END
    let msg = msg . 'Now watching ' . bufspec . ' for external updates...'
  end
  " If they want to disable it, or it is defined and they want to toggle it,
  if l:disable || (l:toggle && l:defined)
    if l:autoread
      let msg = msg . 'Autoread disabled - '
      if a:bufname == '*'
        set noautoread
      else
        setlocal noautoread
      end
    end
    " Using an autogroup allows us to remove it easily with the following
    " command. If we do not use an autogroup, we cannot remove this
    " single :checktime command
    " augroup! checkforupdates
    silent! exec 'au! '.id
    silent! exec 'augroup! '.id
    let msg = msg . 'No longer watching ' . bufspec . ' for external updates.'
  elseif l:defined
    let msg = msg . 'Already watching ' . bufspec . ' for external updates'
  end
  echo msg
  let @"=reg_saved
endfunction

"WatchForChanges!

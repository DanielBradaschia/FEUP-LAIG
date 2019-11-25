/*  board_element(?PieceNumber, ?PieceView)

    Given a PieceNumber unifies PeaceView with the console board representation of that piece
*/
board_element(0, '     ').
board_element(1, '  1  ').
board_element(2, '  2  ').
board_element(3, '  3  ').
board_element(5, '  0  ').

/*  initial_board(+Board)

    Unifies Board with the initial empty game board 6x6 playable area
    Top and Bottom line are the objectives
*/
initial_board([[0,0,0,0,0,0],
               [0,0,0,0,0,0], 
               [0,0,0,0,0,0], 
               [0,0,0,0,0,0], 
               [0,0,0,0,0,0], 
               [0,0,0,0,0,0], 
               [0,0,0,0,0,0], 
               [0,0,0,0,0,0]]).

% Line numbers
line_numbers([' 0  ', ' 1  ', ' 2  ', ' 3  ', ' 4  ', ' 5  ', ' 6  ', ' 7  ']).

% Prints the Board Header
print_board_header:-
    write('     ___________________________________\n').

% Prints the Board Footer
print_board_footer:-
    write('    |_____|_____|_____|_____|_____|_____|\n').

% Prints the 
print_line_footer:-
    write('    |.....|.....|.....|.....|.....|.....|').

% Prints column divisions
print_column_divisions:-
    write('    |     |     |     |     |     |     |').

/*  print_board(+Board)

    Prints the line numbers, game board, separators and column letters
    Makes calls to predicate print_board_rec for each of the lines
*/
print_board(Board) :-
    line_numbers(LineNumbers),
    nl,
    print_board_header,
    print_board_rec(Board, LineNumbers),
    write('       A     B     C     D     E     F\n\n').

/*  print_board_rec(+Line, +LineNumb)

    Prints the current line numbe and line divisions
    If it's the first line 0 or the last line 7 it prints a differnt division
    If it's the 6th line it is also different as it doesnt print the bottom division
*/
print_board_rec([], []).

print_board_rec([Line|Board], [LineNumb|Remainder]):-
    LineNumb = ' 0  ',
    print_column_divisions, nl,
    write(LineNumb), write('|'),
    print_line(Line),
    write('   <- P2\n'),
    print_board_footer,
    print_board_rec(Board, Remainder).

print_board_rec([Line|Board], [LineNumb|Remainder]):-
    LineNumb = ' 2  ',
    print_column_divisions, nl,
    write(LineNumb), write('|'),
    print_line(Line), nl,
    print_line_footer,
    write('                 1, Up\n'),
    print_board_rec(Board, Remainder).

print_board_rec([Line|Board], [LineNumb|Remainder]):-
    LineNumb = ' 3  ',
    print_column_divisions,
    write('                  ^\n'),
    write(LineNumb), write('|'),
    print_line(Line),
    write('                  |\n'),
    print_line_footer,
    write('       4, Left <- . -> 2, Right\n'),
    print_board_rec(Board, Remainder).

print_board_rec([Line|Board], [LineNumb|Remainder]):-
    LineNumb = ' 4  ',
    print_column_divisions,
    write('                  |\n'),
    write(LineNumb), write('|'),
    print_line(Line),
    write('                  v\n'),
    print_line_footer,
    write('                 3, Down\n'),
    print_board_rec(Board, Remainder).

print_board_rec([Line|Board], [LineNumb|Remainder]):-
    LineNumb = ' 6  ',
    print_column_divisions, nl,
    write(LineNumb), write('|'),
    print_line(Line), nl,
    print_board_footer,
    print_board_rec(Board, Remainder).

print_board_rec([Line|Board], [LineNumb|Remainder]):-
    LineNumb = ' 7  ',
    print_column_divisions, nl,
    write(LineNumb), write('|'),
    print_line(Line),
    write('   <- P1\n'),
    print_board_footer, nl,
    print_board_rec(Board, Remainder).

print_board_rec([Line|Board], [LineNumb|Remainder]) :-
    print_column_divisions, nl,
    write(LineNumb), write('|'),
    print_line(Line), nl,
    print_line_footer, nl,
    print_board_rec(Board,Remainder).

/*  print_line(+Line)

    Prints Line
*/
print_line([]).
print_line([Head|Tail]) :-
    board_element(Head, T),
    write(T), write('|'),
    print_line(Tail).

/* set_cell(-Line, -Col, -Piece, -Board, +NewBoard)

    Unifies NewBoard with a Board where ate (Line, Col) is Piece
    Makes calls to predicate set_cell_rec for each of the lines
*/
set_cell(0, Col, Piece, [Head|Tail], [NewHead|Tail]):-
    set_cell_rec(Col, Piece, Head, NewHead).

set_cell(Line, Col, Piece, [Head|Tail], [Head|NewTail]):-
    Line > 0,
    NewLine is Line -1,
    set_cell(NewLine, Col, Piece, Tail, NewTail).

/*  set_cell_rec(-Col, -Piece, -Line, +NewLine)

    Unifies NewLine with a Line where at Col there is a Piece
*/
set_cell_rec(1, Piece, [_|Tail], [Piece|Tail]).

set_cell_rec(Col, Piece, [Head|Tail], [Head|NewTail]):-
    Col > 1,
    NewCol is Col -1,
    set_cell_rec(NewCol, Piece, Tail, NewTail).

/* get_piece(-Line, -Col, -Board, +Piece)

    Retrives the Piece at (Line, Col) from Board
*/
get_piece(Line, Col, Board, Piece):-
    nth0(Line, Board, Nline),
    nth1(Col, Nline, Piece).
    


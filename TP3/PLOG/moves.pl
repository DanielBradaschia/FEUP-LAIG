/*  value_move(+Board, +Player, +Line, +Col, -Val)

    Evaluates a move, when ship at (Line, Col) goes either up or down
    In order to do so, performs the move and evaluates the resulting board
*/
value_move(Board, Player, Line, Col, Dir, Val):-
    get_piece(Line, Col, Board, Ship),
    get_final_place(Line, Col, Dir, Ship, NewLine, NewCol),
    set_cell(Line, Col, 0, Board, NewBoard1),
    set_cell(NewLine, NewCol, Ship, NewBoard1, NewBoard),
    value(NewBoard, Player, Val).

/* get_final_place(+Line, +Col, +Direction, -NewLine, -NewCol)

    Calculates the final destination according to Direction
*/
get_final_place(Line, Col, up, Ship, NewLine, NewCol):-
    NewLine is Line - Ship,
    NewCol is Col.

get_final_place(Line, Col, right, Ship, NewLine, NewCol):-
    NewLine is Line,
    NewCol is Col + Ship.

get_final_place(Line, Col, left, Ship, NewLine, NewCol):-
    NewLine is Line,
    NewCol is Col - Ship.

get_final_place(Line, Col, down, Ship, NewLine, NewCol):-
    NewLine is Line + Ship,
    NewCol is Col.

/*  value(+Board, +Player, -Val)

    Evaluates a Board
    The closer the ships are to the opposite line the more it weighs on Val
    If there are ships on the opposite line it is valued by a lot, winning board.
*/
value(Board, p1, Val):-
    line_value(0, Board, 20, S0),
    line_value(1, Board, 12, S1),
    S01 is S0 + S1,
    line_value(2, Board, 10, S2),
    S012 is S01 + S2,
    line_value(3, Board, 8, S3),
    S0123 is S012 + S3,
    line_value(4, Board, 6, S4),
    S01234 is S0123 + S4,
    line_value(5, Board, 5, S5),
    S012345 is S01234 + S5,
    line_value(6, Board, 1, S6),
    Val is S012345 + S6.

value(Board, p2, Val):-
    line_value(1, Board, 1, S1),
    line_value(2, Board, 5, S2),
    S12 is S1 + S2,
    line_value(3, Board, 6, S3),
    S123 is S12 + S3,
    line_value(4, Board, 8, S4),
    S1234 is S123 + S4,
    line_value(5, Board, 10, S5),
    S12345 is S1234 + S5,
    line_value(6, Board, 12, S6),
    S123456 is S12345 + S6,
    line_value(7, Board, 20, S7),
    Val is S123456 + S7.
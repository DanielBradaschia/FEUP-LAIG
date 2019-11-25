/*	direction(?Input, ?Direction)

	Given an Input unifies Direction with the direction
	Given a Direction unifies with Input the corresponding digit
*/
direction(1, up).
direction(2, right).
direction(3, down).
direction(4, left).

/*	int_to_col(?Input, ?Col)

	Given an Input unifies with Column letter
*/
int_to_col(1, 'A').
int_to_col(2, 'B').
int_to_col(3, 'C').
int_to_col(4, 'D').
int_to_col(5, 'E').
int_to_col(6, 'F').

/*	next_player(?Player, ?NextPlayer)

	Given Player unifies NextPlayer with the opposite player
*/
next_player(p1, p2).
next_player(p2, p1).

/*  available_ships(+Ships)

    Unifies Ships with all the ships that can exist in a game
*/
available_ships([1, 2, 3, 1, 2, 3]).

/* empty_line(+Line)

	Unifies Line with a placeholder to fill user ships
*/
empty_line([0, 0, 0, 0, 0, 0]).

/* replace_line(-Board, -Pos, -Line, +NewBoard)

	Replaces Board line Pos with Line and unifies with NewBoard
*/
replace_line([_|T], 0, X, [X|T]).
replace_line([H|T], I, X, [H|R]):- 
	I > -1, 
	NI is I-1, 
	replace_line(T, NI, X, R).

replace_line(L, _, _, L).

/*	replace_column(-Line, -Pos, -Ship, +NewLine)

	At Pos of Line replaces it with Ship and unifies with NewLine
*/
replace_column([_|T], 1, X, [X|T]).
replace_column([H|T], I, X, [H|R]):- 
	I > 0, 
	NI is I-1, 
	replace_column(T, NI, X, R).

replace_column(L, _, _, L).

/*	copy_list(-L, +R)

	Copies list L into R
	Makes calls to predicate copy_list_rec for each element
*/
copy_list(L, R):-
    copy_list_rec(L,R).

copy_list_rec([], []).
copy_list_rec([H|T1], [H|T2]):- 
	copy_list_rec(T1, T2).

/*	empty(+Line)

	Succeeds if Line is considered empty, meaning it only contains 0 aka no pieces
*/
empty(Line):-
	\+ member(1, Line),
	\+ member(2, Line),
	\+ member(3, Line).

/*	line_value(+Line, +Board, +Mult, -Val)

	Calculates the sum of all elements of Line of Board
	Then multiplies by Mult and unifies the result with Val
*/
line_value(Line, Board, Mult, Val):-
	nth0(Line, Board, L),
	sumlist(L, Ls),
	Val is Ls*Mult.
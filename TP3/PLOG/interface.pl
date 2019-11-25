/*	get_int(-Int)

	Reads a number and unifies it with Int
*/
get_int(Int):-
	get_code(A),
	get_code(_),
	Int is A -48.

/*	get_any_key

	Waits to read any thing from the keyboard
*/
get_any_key:-
	get_char(_).

/*	get_charInt(-Col)

	Reads a character from console and returns its value as an int
	Unifies the result with Col
*/
get_charInt(Col):-
	get_char_nl(Char),
    char_to_int(Char, Col).

/*	get_char_nl(-Char)

	Reads a char from console unifying it with Char
	Reads the reamaing newline character in the console
*/
get_char_nl(Char):-
	get_char(Char),
	get_char(_).

/*  get_coord(+Line, +Col)

    Reads an int and a char from console
    Checks if the values read fall inside the board
	Line value must belong in {0, 1, 2, 3, 4, 5, 6, 7}
	Col value must belong in {1, 2, 3, 4, 5, 6}
*/
get_coord(Line, Col):-
	repeat,
	print_coord_text,
	get_int(Line),
	get_char_nl(ColChar),
	char_to_int(ColChar, Col),
	Line >= 0,
	Line =< 7,
	Col > 0,
	Col < 7,
	!.

/*  get_coord1(+Line, +Col)

    Equal to get_coord but does print the instructions
*/
get_coord1(Line, Col):-
	repeat,
	get_int(Line),
	get_char_nl(ColChar),
	char_to_int(ColChar, Col),
	Line >= 0,
	Line =< 7,
	Col > 0,
	Col < 7,
	!.

/*  get_direction(+Direction)

    Requests user for a direction to move the ship and unifies with Direction
	Makes sure Direction is a known value either 1, 2, 3, 4
*/
get_direction(Direction):-
    repeat,
    print_direction_text,
    get_int(Input),
    direction(Input, Direction),
    !.

/*  get_next_coords(-Direction, -Line, -Col, +NewLine, +NewCol, +Flag)

    Given Direction calculates next coord and unifies with NewLine and NewCol
    Flag checks for boudaries, for example player cant go up on line 0
*/
get_next_coords(up, Line, Col, NewLine, NewCol, Flag):-
    (Line = 0 -> Flag is 1; Flag is 0),
    NewLine is Line -1,
    NewCol is Col.

get_next_coords(right, Line, Col, NewLine, NewCol, Flag):-
    (Col = 6 -> Flag is 1; Flag is 0),
    NewLine is Line,
    NewCol is Col +1.

get_next_coords(down, Line, Col, NewLine, NewCol, Flag):-
    (Line = 7 -> Flag is 1; Flag is 0),
    NewLine is Line +1,
    NewCol is Col.

get_next_coords(left, Line, Col, NewLine, NewCol, Flag):-
    (Col = 0 -> Flag is 1; Flag is 0),
    NewLine is Line,
    NewCol is Col -1.

/*	char_to_int(+Char, -Int)

	Instantiates Int to the corresponding number assuming a is 0 and z is 25
	Adds 1 to the result given the board works with column indexes starting at 1
*/
char_to_int(Char, Int):-
	Char @>= 'A',
	Char @=< 'Z',
	char_code('A', AsciiA),
	char_code(Char, AsciiChar),
	Int is AsciiChar - AsciiA +1.

char_to_int(Char, Int):-
	Char @>= 'a',
	Char @=< 'z',
	char_code('a', AsciiA),
	char_code(Char, AsciiChar),
	Int is AsciiChar - AsciiA +1.

/*	clear_console

	Clears the console with the ASCII code for it
*/
clear_console:-
	write('\33\[2J').

/*	choose_power_move(-Move)

	Prints the power move options to the screen and then checks if its valid
	Unifies the valid option with Move
*/
choose_power_move(Move):-
    print_power_move,
	get_int(Option),
	Option >= 1,
	Option =< 2,
	Move is Option,
	nl.

/* print_power_move

	Prints power move menu
*/
print_power_move:-
	write('\n  --- Choose powe move ---\n'),
	write('   1 - Reprogram Coordinates\n'),
	write('   2 - Rocket Boost\n'),
	repeat,
	write('   Insert Option: ').

/*	print_player_turn(+Player)

	Prints that the current turn belongs to Player
*/
print_player_turn(Player):-
	write('=== Player '), write(Player), write(' turn ===\n').

/*	print_player_place_ships(Player)

	Indicates which player has to place its ships
*/
print_player_place_ships(Player):-
	write('=== Player '), write(Player), write(' place ships ===\n').

/*	print_place_ship(+Ship)

	Prints the place ship request
*/
print_place_ship(Ship):-
	write('  Place ship '), write(Ship), write(' where? ').

/*	print_coord_text

	Prints the coord request from user
*/
print_coord_text:-
	write('  Select Ship to play [Line, Column]: ').

/*	print_direction_text

	Prints the direction request from user
*/
print_direction_text:-
	write('  Insert direction to move ship: ').

/*	print_replace_ship(+Line, +ColNum)

	Prints the request to change ship location
*/
print_replace_ship(Line, ColNum):-
	int_to_col(ColNum, Col),
	write('  Select ship at '), write(Line), write(', '), write(Col), write(' destination [Line, Column]: ').

/*	print_player_won(+Player)

	Prints the information that Player won the game
*/
print_player_won(Player):-
	write('\n    ========================\n\n'),
    write('       '), write(Player), write(' WON THE GAME !!  \n\n'),
    write('    ========================\n'),
    write('    Press any key to continue: ').

/*	print_bot_cant_move(+BotDiff)

	Prints to the console saying the bot has run out of moves
*/
print_bot_cant_move(BotDiff):-
	write('\n================================================\n\n'),
	write('   Bot '), write(BotDiff), write(' doesnt have more moves available\n'),
	write('   Bot forfeits, player wins !!\n'),
	write('================================================\n\n'),
	write('Press any key to continue: ').

/*	print_bot_move(+Line, +Col, +Dir)

	Prints to the console that the ship at (Line, Col) will be moved int the direction of Dir
*/
print_bot_move(Line, Col, Dir):-
	int_to_col(Col, Ltr),
	write('   Ship at '), write(Line), write(', '), write(Ltr), write(' will be moved '), write(Dir),
	nl.
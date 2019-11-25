/*  create_pvp_game(-Game)

    Creates a new game player vs player
    Game is unified with a list which contains the initial board and the first player
*/
create_pvp_game(Game):-
    initial_board(Board),
    Game = [Board, p1].

/*  create_pvb_game(-Game, +BotDiff, +First)

    Creates a new game player vs bot
    Game is unifies with a  list which contains the initial board the bot dificulty and the first player
*/
create_pvb_game(Game, BotDiff, First):-
    initial_board(Board),
    Game = [Board, BotDiff, First].

/*   create_bvb_game(-Game)

    Creates a new game of bot vs bot
    Game is unified with a lista which contains the initial board and the 2 bots difficulty
*/
create_bvb_game(Game):-
    initial_board(Board),
    Game=[Board, smart, random].

/*  play_game([+Board, +Player])

    If board matches the initial board, this is when the players setup their game
    Each player places its ships on the line closes to them, ordered as they wish
*/
play_game([Board, Player|[]]):-
    clear_console,
    initial_board(Board),
    print_board(Board),
    print_player_place_ships(p1),
    set_ships(p1, Board, NewBoard1),
    clear_console,
    print_board(NewBoard1),
    print_player_place_ships(p2),
    set_ships(p2, NewBoard1, NewBoard),
    clear_console,
    print_board(NewBoard),
    play_game([NewBoard, Player]).

/*  play_game([+Board, +Player])

    Makes call to execute a plater turn
    Makes recursive call to start next player turn
*/
play_game([Board, Player|[]]):-
    player_turn(Board, NewBoard, Player, NextPlayer),
    play_game([NewBoard, NextPlayer]).

/*  play_game([+Board, +BotDiff, player])

    BotDiff is the bot dificulty
    The user plays first
    This play_game is used to setup the board, each party places its ships on the row closest to him
*/
play_game([Board, BotDiff, player|[]]):-
    initial_board(Board),
    print_board(Board),
    print_player_place_ships(player),
    set_ships(p1, Board, NewBoard1),
    clear_console,
    print_board(NewBoard1),
    print_player_place_ships(bot),
    bot_set_ships(NewBoard1, 1, NewBoard),
    clear_console,
    print_board(NewBoard),
    play_game([NewBoard, BotDiff, player]).

/*  play_game([+Board, +BotDiff, bot])

    BotDiff is the bot difficulty
    The bot plays first
    This play_game is used to setup the board, each party places its ships on the row closest to him
*/
play_game([Board, BotDiff, bot|[]]):-
    initial_board(Board),
    print_board(Board),
    print_player_place_ships(bot),
    bot_set_ships(Board, 6, NewBoard1),
    clear_console,
    print_board(NewBoard1),
    print_player_place_ships(player),
    set_ships(p2, NewBoard1, NewBoard),
    clear_console,
    print_board(NewBoard),
    play_game([NewBoard, BotDiff, bot]).

/*  play_game([+Board, +BotDiff, player])

    BotDiff is the bot dificulty
    The user plays first
*/
play_game([Board, BotDiff, player|[]]):-
    player_turn(Board, NewBoard1, p1, _),
    bot_turn(NewBoard1, NewBoard, p2, BotDiff),
    play_game([NewBoard, BotDiff, player]).

/*  play_game([+Board, +BotDiff, bot])

    BotDiff is the bot difficulty
    The bot plays first
*/
play_game([Board, BotDiff, bot|[]]):-
    bot_turn(Board, NewBoard1, p1, BotDiff),
    player_turn(NewBoard1, NewBoard, p2, _),
    play_game([NewBoard, BotDiff, bot]).

play_game([Board, smart, random|[]]):-
    clear_console,
    initial_board(Board),
    bot_set_ships(Board, 1, NewBoard1),
    bot_set_ships(NewBoard1, 6, NewBoard),
    print_board(NewBoard),
    get_any_key,
    play_game([NewBoard, smart, random]).

play_game([Board, smart, random|[]]):-
    bot_turn(Board, NewBoard1, p1, random),
    bot_turn(NewBoard1, NewBoard, p2, smart),
    get_any_key,
    play_game([NewBoard, smart, random]).

/*  game_over(+Player, +Board)

    Given Player cheks if line 0 or 7 aren't empty if so it means Player won
*/
game_over(p1, Board):-
    nth0(0, Board, Line),
    \+ empty(Line),
    clear_console,
    print_board(Board),
    print_player_won(p1),
    get_any_key,
    main_menu, !.

game_over(p2, Board):-
    nth0(7, Board, Line),
    \+ empty(Line),
    clear_console,
    print_board(Board),
    print_player_won(p2),
    get_any_key,
    main_menu, !.

% Calls to other predicats failed, means neither p1 or p2 have won
game_over(_, _).

/*  player_turn(+Board, -NewBoard, +Player, -NextPlayer)

    Prints Board
    Executes Player move
    Changes NextPlayer to opposite of Player
    Checks if Player has won the game
*/
player_turn(Board, NewBoard, Player, NextPlayer):-
    clear_console,
    print_board(Board),
    print_player_turn(Player),
    move(Player, Board, NewBoard),
    next_player(Player, NextPlayer),
    game_over(Player, NewBoard).

/*  move(+Player, +Board, -NewBoard)

    Asks Player for coordinates of the ship to move
    Checks if the ship chosen is valid
    Executes player move
    Checks if player hasnt forfeited by moving to his home row
*/
move(Player, Board, NewBoard):-
    repeat,
    get_coord(Line, Col),
    validate_correct_line(Player, Board, Line),             % Checks if there is any Line close to Player that has ships
    get_piece(Line, Col, Board, Ship),
    Ship =\= 0,                                             % Checks if Pice at Line Col is a spaceship
    player_move(Ship, Ship, Line, Col, Board, NewBoard),
    check_cheeky_play(Player, NewBoard),                    % Checks if Player hasnt move the ship to its own line
    !.

/*  player_move(+Ship, +NMoves, +Line, +Col, +Board, -NewBoard)

    Asks for the direction to move Ship from Line Col
    If its a middle move the cell must be empty
    If its the last move also asks for power move
    In the end unifies Ship new location with NewBoard
    The last move can trigger a power move if Ship falls on an occupied square
*/
player_move(Ship, 1, Line, Col, Board, NewBoard):-
    repeat,
    get_direction(Dir),
    get_next_coords(Dir, Line, Col, NewLine, NewCol, Flag),
    Flag =\= 1,
    get_piece(NewLine, NewCol, Board, Piece),
    set_cell(Line, Col, 0, Board, NewBoard1),
    (Piece = 0 -> 
        set_cell(NewLine, NewCol, Ship, NewBoard1, NewBoard)
        ;
        choose_power_move(Move),
        (Move = 1 ->
            reprogram_coordinates(Piece, Ship, NewLine, NewCol, NewBoard1, NewBoard)
            ;
            rocket_boost(Piece, Ship, NewLine, NewCol, NewBoard1, NewBoard)
        )
    ),
    !.

/*  player_move(+Ship, +NMoves, +Line, +Col, +Board, -NewBoard)

    Asks for the direction to move Ship from Line Col
    If its a middle move the cell must be empty
    If its the last move also asks for power move
    In the end unifies Ship new location with NewBoard
    Intermidiate moves must pass through empty squares
*/
player_move(Ship, NMoves, Line, Col, Board, NewBoard):-
    NMoves1 is NMoves -1,
    repeat,
    get_direction(Dir),
    get_next_coords(Dir, Line, Col, NewLine, NewCol, Flag),
    Flag =\= 1,
    get_piece(NewLine, NewCol, Board, Piece),
    Piece = 0,
    set_cell(Line, Col, 0, Board, NewBoard1),
    player_move(Ship, NMoves1, NewLine, NewCol, NewBoard1, NewBoard),
    !.

/*  reprogram_coordinates(+Piece, +Ship, +Line, +Col, +Board, -NewBoard)

    Asks for Piece new coordinates and checks if is inside playable area and empty
    Places Ship at (Line, Col)
    Unifies with NewBoard
*/
reprogram_coordinates(Piece, Ship, Line, Col, Board, NewBoard):-
    repeat,
    print_replace_ship(Line, Col),
    get_coord1(NewLine, NewCol),
    NewLine >= 1,
    NewLine =< 6,
    get_piece(NewLine, NewCol, Board, Cell),
    write(Cell), 
    Cell = 0,
    set_cell(NewLine, NewCol, Piece, Board, NewBoard1),
    set_cell(Line, Col, Ship, NewBoard1, NewBoard),
    !.

/*  rocket_boost(+NMoves, +Ship, +Line, +Col, +Board, -NewBoard)

    Rocket boost in essence is a new turn for the same player so it calls player_move
    At the end it places the ship that occupied that square, back in its place
*/
rocket_boost(NMoves, Ship, Line, Col, Board, NewBoard):-
    player_move(Ship, NMoves, Line, Col, Board, NewBoard1),
    set_cell(Line, Col, NMoves, NewBoard1, NewBoard).

/*  validate_correct_line(+Player, +Board, +Line)

    Given the Player it either checks backwards or forwards if there is any line
    that still has a ship
*/
validate_correct_line(p1, _, 7):-!.
validate_correct_line(p1, Board, LineNum) :-
    BefLine is LineNum +1,
    nth0(BefLine, Board, Line),
    empty(Line),
    validate_correct_line(p1, Board, BefLine).

validate_correct_line(p2, _, 0):-!.
validate_correct_line(p2, Board, LineNum) :-
    BefLine is LineNum -1,
    nth0(BefLine, Board, Line),
    empty(Line),
    validate_correct_line(p2, Board, BefLine).

/*  check_cheecky_play(+Player, +Board)

    Checks if the Player hasn't made a play in which he would lose
*/
check_cheeky_play(p1, Board):-
    nth0(7, Board, Line),
    empty(Line).

check_cheeky_play(p2, Board):-
    nth0(0, Board, Line),
    empty(Line).

/*  set_ships(-Player, -Board, +NewBoard):-

    Asks Player to place its ships on the correct side of the Board
    Unifies Board with NewBoard, where NewBoard and the ships placed.
*/
% Foi feito 2 predicados para cada Jogador de forma a tornar o código mais percetível
set_ships(p1, Board, NewBoard):-
    available_ships(Ships),
    empty_line(Line),
    fill_line_ship(Ships, Line, NewLine),
    replace_line(Board, 6, NewLine, NewBoard).

set_ships(p2, Board, NewBoard):-
    available_ships(Ships),
    empty_line(Line),
    fill_line_ship(Ships, Line, NewLine),
    replace_line(Board, 1, NewLine, NewBoard).

/*  fill_line_ship(-Ships, -Line, +NewLine)

    Makes recurvise calls to place_ship
    At the end copies the resutl to NewLine
*/
fill_line_ship([], Line, NewLine):-
    copy_list_rec(Line, NewLine).

fill_line_ship([Ship|Rest], Line, NewLine):-
    place_ship(Ship, Line, NewLine1),
    fill_line_ship(Rest, NewLine1, NewLine).

/*  place_ship(-Ship, -Line, -NewLine)

    Asks user for the coloumn where to place Ship
    Checks if coloumn is valid, then checks if Line at Col is empty
    Then places Ship at Col and unifies with NewLine
*/
place_ship(Ship, Line, NewLine):-
    repeat,
    print_place_ship(Ship),
    get_charInt(Col),
    Col =<6,
    Col > 0,
    nth1(Col, Line, Piece),
    Piece = 0,
    replace_column(Line, Col, Ship, NewLine),
    !.
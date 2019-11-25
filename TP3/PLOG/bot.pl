/*  direction_player(?Player, ?Direction)

    Given a Player unifies Direction with the corresponding direction
*/
direction_player(p1, up).
direction_player(p2, down).

/*  bot_set_ships(+Board, +Row, -NewBoard)

    Randomly chooses ships from available ships and places them on a line
    Replaces Row of Board with said line and unifies with NewBoard
*/
bot_set_ships(Board, Row, NewBoard):-
    available_ships(Ships),
    random_select(Ship1, Ships, Rest1),
    random_select(Ship2, Rest1, Rest2),
    append([Ship1], [Ship2], L1),
    random_select(Ship3, Rest2, Rest3),
    append(L1, [Ship3], L2),
    random_select(Ship4, Rest3, Rest4),
    append(L2, [Ship4], L3),
    random_select(Ship5, Rest4, Ship6),
    append(L3, [Ship5], L4),
    append(L4, Ship6, NewLine),
    replace_line(Board, Row, NewLine, NewBoard).

/*  bot_turn(+Board, -NewBoard, +Player, +BotDiff)

    Prints Board
    Executes Bot move according to wether the bot is p1 or p2
    Checks if Bot won the game
*/
bot_turn(Board, NewBoard, Player, BotDiff):-
    clear_console,
    print_board(Board),
    print_player_turn(BotDiff),
    choose_move(BotDiff, Board, NewBoard, Player),
    game_over(Player, NewBoard).

/* choose_move(+BotDiff, +Board, -NewBoard, +Player)

    Depending on BotDiff calculates Line and Col of next move, unifies with NewBoard
*/
choose_move(random, Board, NewBoard, Player):-
    valid_moves(Board, ValidMoves, Player),
    length(ValidMoves, NMoves),
    (NMoves = 0 ->
        bot_cant_move(random, Board)
        ;
        random(0, NMoves, Move),
        nth0(Move, ValidMoves, Line-Col-Dir),
        print_bot_move(Line, Col, Dir),
        bot_move(Line, Col, Dir, Board, NewBoard)
    ).

choose_move(smart, Board, NewBoard, Player):-
    findall(Val-Line-Col-Dir, 
        (valid_move(Board, Player, Line, Col, Dir),
         value_move(Board, Player, Line, Col, Dir, Val)
         ),
         ValidMoves),
    length(ValidMoves, L),
    (L = 0 -> 
        bot_cant_move(smart, Board)
        ;
        max_member(_-NewLine-NewCol-Dir, ValidMoves),
        print_bot_move(NewLine, NewCol, Dir),
        bot_move(NewLine, NewCol, Dir, Board, NewBoard)
    ).

/*  bot_move(+Line, +Col, +Board, -NewBoard)

    Moves ship at Line,Col forward/back number of times equal to its value
    Unifies the result in NewBoard
*/
bot_move(Line, Col, Dir, Board, NewBoard):-
    get_piece(Line, Col, Board, Ship),
    get_final_place(Line, Col, Dir, Ship, NewLine, NewCol),
    set_cell(Line, Col, 0, Board, NewBoard1),
    set_cell(NewLine, NewCol, Ship, NewBoard1, NewBoard).

/*  valid_moves(+Board, -ValidMoves, +Player)

    Returns a list, ValidMoves of the valid moves in Board taking into account which Player is playing
*/
valid_moves(Board, ValidMoves, Player):-
    findall(Line-Col-Dir, valid_move(Board, Player, Line, Col, Dir), ValidMoves).

valid_move(Board, Player, 1, Col, Dir):-
    validate_correct_line(Player, Board, 1),
    get_piece(1, Col, Board, Ship),
    Ship =\= 0,
    simulate_move(Ship, 1, Col, Dir, Board, Player).

valid_move(Board, Player, 2, Col, Dir):-
    validate_correct_line(Player, Board, 2),
    get_piece(2, Col, Board, Ship),
    Ship =\= 0,
    simulate_move(Ship, 2, Col, Dir, Board, Player).

valid_move(Board, Player, 3, Col, Dir):-
    validate_correct_line(Player, Board, 3),
    get_piece(3, Col, Board, Ship),
    Ship =\= 0,
    simulate_move(Ship, 3, Col, Dir, Board, Player).

valid_move(Board, Player, 4, Col, Dir):-
    validate_correct_line(Player, Board, 4),
    get_piece(4, Col, Board, Ship),
    Ship =\= 0,
    simulate_move(Ship, 4, Col, Dir, Board, Player).

valid_move(Board, Player, 5, Col, Dir):-
    validate_correct_line(Player, Board, 5),
    get_piece(5, Col, Board, Ship),
    Ship =\= 0,
    simulate_move(Ship, 5, Col, Dir, Board, Player).

valid_move(Board, Player, 6, Col, Dir):-
    validate_correct_line(Player, Board, 6),
    get_piece(6, Col, Board, Ship),
    Ship =\= 0,
    simulate_move(Ship, 6, Col, Dir, Board, Player).
    
/*  simulate_move(+NMoves, +Line, +Col, +Board, +Player)

    Simulates a ship moving forward/back checking if the moving conditions are valid
*/
simulate_move(0, _, _, _, _, _).
simulate_move(NMoves, Line, Col, Dir, Board, Player):-
    NMovse1 is NMoves -1,
    next_coords(Player, Line, Col, Dir, NewLine, NewCol, Flag),
    Flag =\= 1,
    get_piece(NewLine, NewCol, Board, Piece),
    Piece = 0,
    simulate_move(NMovse1, NewLine, NewCol, Dir, Board, Player).

/*  next_coords(+Player, +Line, +Col, -NewLine, -NewCol, -Flag)

    Gets the new coordinates if the ship moved up or down, depending on the player
*/
next_coords(p1, Line, Col, up, NewLine, NewCol, Flag):-
    get_next_coords(up, Line, Col, NewLine, NewCol, Flag).

next_coords(_, Line, Col, right, NewLine, NewCol, Flag):-
    get_next_coords(right, Line, Col, NewLine, NewCol, Flag).

next_coords(_, Line, Col, left, NewLine, NewCol, Flag):-
    get_next_coords(left, Line, Col, NewLine, NewCol, Flag).

next_coords(p2, Line, Col, down, NewLine, NewCol, Flag):-
    get_next_coords(down, Line, Col, NewLine, NewCol, Flag).

/*  bot_cant_move(+BotDiff, +Board)

    Prints message saying theres no moves available to bot
*/
bot_cant_move(BotDiff, Board):-
    clear_console,
    print_board(Board),
    print_bot_cant_move(BotDiff),
    get_any_key,
    main_menu.

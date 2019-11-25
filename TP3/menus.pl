% Main menu
main_menu:-
    print_main_menu,
    get_int(Option),
    main_menu_option(Option).

print_main_menu:-
    clear_console,
    write('===========================\n\n'),
    write('           XERO-G           \n\n'),
    write('===========================\n\n'),
    write('   1- Play                 \n'),
    write('   2- How to Play          \n'),
    write('   3- About                \n'),
    write('   4- Exit                 \n'),
    write('===========================\n\n'),
    write('Insert an option:   ').

main_menu_option(1):-
    game_mode.

main_menu_option(2):-
    how_to_play.

main_menu_option(3):-
    about.

% Forces an abort
main_menu_option(4):- abort.

main_menu_option(_):-
    write('\nError: Invalid input\n'),
    main_menu.

% Game Mode menu
game_mode:-
    print_game_mode,
    get_int(Option),
    game_mode_option(Option).

print_game_mode:-
    clear_console,
    write('==========================\n\n'),
    write('        GAME  MODE        \n'),
    write('==========================\n\n'),
    write('   1- Player vs. Player   \n'),
    write('   2- Player vs Bot       \n'),
    write('   3- Bot vs Bot          \n'),
    write('   4- Back                \n'),
    write('==========================\n\n'),
    write('Insert an option: ').

game_mode_option(1):-
    create_pvp_game(Game),
    play_game(Game).

game_mode_option(2):-
    player_vs_bot.

game_mode_option(3):-
    create_bvb_game(Game),
    play_game(Game).

game_mode_option(4):-
    main_menu.

game_mode_option(_):-
    write('\nError: Invalid input\n'),
    game_mode.

% Player vs Bot Difficulty menu
player_vs_bot:-
    print_player_vs_bot,
    get_int(Option),
    player_vs_bot_option(Option).

print_player_vs_bot:-
    clear_console,
    write('====================\n\n'),
    write('   BOT DIFFICULTY   \n'),
    write('====================\n\n'),
    write('   1- Random        \n'),
    write('   2- \'Smart\'     \n'),
    write('   3- Back          \n'),
    write('====================\n\n'),
    write('Insert an option:  ').

player_vs_bot_option(1):-
    first_player(random).

player_vs_bot_option(2):-
    first_player(smart).

player_vs_bot_option(3):-
    game_mode.

player_vs_bot_option(_):-
    write('\nError: Invalid input\n'),
    player_vs_bot.

% First Player Menu
first_player(BotDiff):-
    print_first_player,
    get_int(Option),
    first_player_option(Option, BotDiff).

print_first_player:-
    clear_console,
    write('==================\n\n'),
    write('   FIRST PLAYER   \n'),
    write('==================\n\n'),
    write('   1- Me          \n'),
    write('   2- Bot         \n'),
    write('   3- Back        \n'),
    write('==================\n\n'),
    write('Insert an option: ').

first_player_option(1, BotDiff):-
    create_pvb_game(Game, BotDiff, player),
    play_game(Game).

first_player_option(2, BotDiff):-
    create_pvb_game(Game, BotDiff, bot),
    play_game(Game).

first_player_option(3, _):-
    player_vs_bot.

first_player_option(_, BotDiff):-
    first_player(BotDiff).

% How to play Display
how_to_play:-
    print_how_to_play,
    get_any_key,
	main_menu.

print_how_to_play:-
	clear_console,
    write('=======================================================================================================\n\n'),
    write('                                              HOW TO PLAY                                              \n\n'),
	write('=======================================================================================================\n\n'),
    write('   Each player places their ships in the row closest to him                                            \n'),
	write('                                                                                                       \n'),
	write('   The player must choose one ship to move from the row closest to him                                 \n'),
	write('   A ship of value x can move x times.                                                                 \n'),
	write('                                                                                                       \n'),
	write('   Each square that a ship passes must be empty                                                        \n'),
	write('   The final square can be occupied or not                                                             \n'),
	write('                                                                                                       \n'),
	write('   If the last square is occupied the player can choose between 2 power moves:                         \n'),
	write('   - Reporgram Coordinates: Place the ship currently occupying said square on another empty square     \n'),
    write('   - Rocket Boost: Your ship can move the number of squares corresponding to the ship on that square   \n'),
	write('   Rocket Boots can be chained and behave like a normal move                                           \n'),
    write('                                                                                                       \n'),
	write('   To win the game a player must navigate a ship to the row closest to the oponnent                    \n'),
	write('=======================================================================================================\n\n'),
	write('   Press any key to return                                                                             \n').
    
% About Display
about:-
    print_about,
    get_any_key,
    main_menu.

print_about:-
    clear_console,
    write('=====================================================================================\n\n'),
    write('                                        ABOUT                                        \n\n'),
    write('=====================================================================================\n\n'),
    write('   Xero G is a 2 player strategy game on a square board with orthogonal grid lines   \n'),
    write('   The board is 6x6 with the top and bottom most lines representing the objectives   \n'),
    write('                                                                                     \n'),
    write('   This game was designed by Kat Costa                                               \n'),
    write('                                                                                     \n'),
    write('   Xero G was developed for the course of Logic Programming                          \n'),
    write('                                                                                     \n'),
    write('   It is written entirely in SICStus PROLOG                                          \n'),
    write('                                                                                     \n'),
    write('   Developed by:                                                                     \n'),
    write('    - Simao Oliveira                                                                 \n'),
    write('    - Diogo Mendes                                                                   \n'),
    write('=====================================================================================\n\n'),
    write('   Press any key to return                                                           \n').

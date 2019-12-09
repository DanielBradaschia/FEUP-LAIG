/**
* MyXero_G
* @constructor
*/
class MyXero_G extends CGFobject {
    constructor(scene) {
        console.log(" > XERO-G: NEW GAME");
        super(scene);

        this.defaultCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.rotationCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 0, 0), vec3.fromValues(3, 0, 3));

        this.player1 = new MyPlayer(this.scene, 1);
        this.player2 = new MyPlayer(this.scene, 2);

        this.state = {
            WAITING_FOR_START: 0,
            ADDING_FIRST_WORKER: 1,
            ADDING_SECOND_WORKER: 2,
            CHOOSING_MOVE_PIECE: 3,
            CHOOSING_PIECE_NEW_CELL: 4,
            ADDING_PLAYER: 5,
            WON_GAME: 6,
            DRAW_GAME: 7,
            QUIT_GAME: 8,
            MOVIE: 9,
            CONNECTION_ERROR: 10,
        };

        this.mode = {
            PLAYER_VS_PLAYER: 0,
            PLAYER_VS_BOT: 1,
            BOT_VS_BOT: 2
        };

        this.board = [];
        this.moves = [];

        this.player = 0;

        this.currentState = this.state.WAITING_FOR_START;
        this.previousState = this.state.WAITING_FOR_START;

        this.pieceSavedRow;
        this.pieceSavedColumn;
        this.scene.camera = this.defaultCamera;

        this.scene.information = "Choose a game mode and press Start Game to play Xero-G!";
    }

    start (gameMode, gameLevel) {

        if (this.currentState == this.state.WAITING_FOR_START) {

            switch (gameMode) {
                case "Player vs Player":
                    this.gameMode = this.mode.PLAYER_VS_PLAYER;
                    break;
                case "Player vs Bot":
                    this.gameMode = this.mode.PLAYER_VS_BOT;
                    break;
                case "Bot vs Bot":
                    this.gameMode = this.mode.BOT_VS_BOT;
                    break;
                default:
                    break;
            }

            switch (gameLevel) {
                case "Random":
                    this.gameLevel = 0;
                    break;
                case "Smart":
                    this.gameLevel = 1;
                    break;
                default:
                    break;
            }

            this.setVariables();
            this.getInitialBoard();
            this.player1.startCounter();
        }

    }

    setVariables() {
        this.moves = [];
        this.player = 1;
        this.previousPlayer = 1;
    }

    quit() {
        if (this.currentState != this.state.WAITING_FOR_START && this.currentState != this.state.MOVIE) {
            this.currentState = this.state.QUIT_GAME;
            this.nextState();
        }
    }

    cleanBoard() {
        var board = [];
        for (var i = 0; i < 11; i++) {
            var line = [];
            for (var j = 0; j < 11; j++) {
                line.push(new MyPiece(this.scene, j, i, "0"));
            }
            board.push(line);
        }
        this.board = board; 
    }

    setPlayerTimes () {
        switch (this.player) {
            case 1:
                this.player2.stopCounter();
                this.player1.clearTime();
                if (this.gameLevel == 1 && this.currentState != this.state.ADDING_FIRST_WORKER && this.currentState != this.state.ADDING_SECOND_WORKER) this.player1.startDecCounter();
                else this.player1.startCounter();
                break;
            case 2:
                this.player1.stopCounter();
                this.player2.clearTime();
                if (this.gameLevel == 1 && this.currentState != this.state.ADDING_FIRST_WORKER && this.currentState != this.state.ADDING_SECOND_WORKER) this.player2.startDecCounter();
                else this.player2.startCounter();
                break;
            default:
                break;
        }
    }

    freezePlayerTimes () {
        this.player2.stopCounter();
        this.player1.clearTime();
        this.player1.stopCounter();
        this.player2.clearTime();
    }

    getPlayerDecTime () {
        switch (this.player) {
            case 1:
                this.playersTime = this.player1.totalSeconds;
                break;
            case 2:
                this.playersTime = this.player2.totalSeconds;
                break;
            default:
                break;
        }
    }

    checkLevelTime () {
        if (this.gameLevel == 1) {
            if (this.currentState != this.state.WAITING_FOR_START && this.currentState != this.state.ADDING_FIRST_WORKER && this.currentState != this.state.ADDING_SECOND_WORKER) {
                if (this.gameMode == this.mode.PLAYER_VS_PLAYER || (this.gameMode == this.mode.PLAYER_VS_BOT && this.player == 1)) {
                    this.getPlayerDecTime();
                    if (this.playersTime <= 0) this.nextState();
                }
            }
        }
    }

    /*
    * CAMERA
    */

    setCamera () {
        if (this.scene.rotationCamera) {
            if (this.player == 0 || this.player == 1) {
                this.rotationCamera.setPosition(this.player1.position);
            } else {
                this.rotationCamera.setPosition(this.player2.position);
            }
            this.rotationCamera.zoom(4);
            this.scene.camera = this.rotationCamera;
        } else {
            this.scene.camera = this.defaultCamera;
        }
    }

    rotateCamera() {
        if (this.scene.rotationCamera) {
            this.scene.cameraRotationAngle = Math.PI;
            this.scene.cameraRotationActive = true;
        }
    }

    getCurrPlayerId () {
        if (this.player == 1) return "1";
        else if (this.player == 2) return "2";
    }

    undo() {

        if (this.gameMode == this.mode.PLAYER_VS_PLAYER) {

            if (this.currentState != this.state.WAITING_FOR_START && this.currentState != this.state.MOVIE) {

                if (this.moves.length > 0) {
                    console.log(" > XERO-G: Undoing move...");

                    var moveToUndo = this.moves[this.moves.length - 1];

                    if (moveToUndo.type == "add") {
                        let rowIndex = moveToUndo.newCell[0] - 1;
                        let columnIndex = moveToUndo.newCell[1] - 1;

                        this.board[rowIndex][columnIndex] = new MyPiece(this.scene, columnIndex, rowIndex, "0");
                    } else if (moveToUndo.type == "move") {
                        let rowIndex = moveToUndo.newCell[0] - 1;
                        let columnIndex = moveToUndo.newCell[1] - 1;
                        var oldRowIndex = moveToUndo.cell[0] - 1;
                        var oldColumnIndex = moveToUndo.cell[1] - 1;

                        this.board[rowIndex][columnIndex] = new MyPiece(this.scene, columnIndex, rowIndex, "0");
                        this.board[oldRowIndex][oldColumnIndex] = new MyPiece(this.scene, oldColumnIndex, oldRowIndex, "3");
                    }

                    this.currentState = moveToUndo.state;
                    this.player = moveToUndo.player;

                    console.log(" > XERO-G: " + "PLAYER " + this.getCurrPlayerId() + " TURN");
                    this.moves.splice(this.moves.length - 1);
                    this.rotateCamera();
                    this.setPlayerTimes();
                }
            }
        }
    }

    makeMovieMove (move) {

        var playerNumber;

        switch (move.player) {
            case "1":
                playerNumber = "1";
                break;
            case "2":
                playerNumber = "2";
                break;
        }

        if (move.type == "add") {
            let rowIndex = move.newCell[0] - 1;
            let columnIndex = move.newCell[1] - 1;

            this.board[rowIndex][columnIndex] = new MyPiece(this.scene, columnIndex, rowIndex, playerNumber);

            this.board[rowIndex][columnIndex].setAnimation(0, 0, move.player);

        } else if (move.type == "move") {
            let rowIndex = move.newCell[0] - 1;
            let columnIndex = move.newCell[1] - 1;
            var oldRowIndex = move.cell[0] - 1;
            var oldColumnIndex = move.cell[1] - 1;

            this.board[rowIndex][columnIndex] = new MyPiece(this.scene, columnIndex, rowIndex, playerNumber);
            this.board[oldRowIndex][oldColumnIndex] = new MyPiece(this.scene, oldColumnIndex, oldRowIndex, "0");

            this.board[rowIndex][columnIndex].setAnimation(oldColumnIndex, oldRowIndex);
        }
    }

    movie() {

        if (this.currentState == this.state.WAITING_FOR_START && this.moves.length > 0) {

            this.currentState = this.state.MOVIE;

            this.cleanBoard();

            for (let i = 0; i < this.moves.length; i++) {
                setTimeout(function () { this.makeMovieMove(this.moves[i]); }.bind(this), 2000 * i);
            }

            setTimeout(function () { this.currentState = this.state.WAITING_FOR_START; }.bind(this), 2000 * this.moves.length);
        }
    }

    nextPlayer() {
        this.previousPlayer = this.player;
        switch (this.player) {
            case 1:
                this.player = 2;
                this.rotateCamera();
                this.setPlayerTimes();
                break;
            case 2:
                this.player = 1;
                this.rotateCamera();
                this.setPlayerTimes();
                break;
            default:
                break;
        }
    }

    nextState (toMovePiece) {

        if (this.previousState == this.state.WAITING_FOR_START)
            this.previousState = this.state.ADDING_FIRST_WORKER;
        else this.previousState = this.currentState;

        switch (this.currentState) {
            case this.state.WAITING_FOR_START:
                this.currentState = this.state.ADDING_FIRST_WORKER;
                this.scene.information = "Choose a cell to add the first worker.";
                if (this.gameMode == this.mode.BOT_VS_BOT) this.BOTaddPiece();
                break;
            case this.state.ADDING_FIRST_WORKER:
                this.currentState = this.state.ADDING_SECOND_WORKER;
                this.nextPlayer();
                this.scene.information = "Choose a cell to add the second worker.";
                if (this.gameMode == this.mode.BOT_VS_BOT || this.gameMode == this.mode.PLAYER_VS_BOT) this.BOTaddPiece();
                break;
            case this.state.ADDING_SECOND_WORKER:
                this.currentState = this.state.CHOOSING_MOVE_PIECE;
                this.nextPlayer();
                this.scene.information = "If you want to move a worker choose a cell with a worker, otherwise choose a cell to put one of your pieces.";
                if (this.gameMode == this.mode.BOT_VS_BOT) this.BOTchooseMovePiece();
                break;
            case this.state.CHOOSING_MOVE_PIECE:
                if (toMovePiece) {
                    this.currentState = this.state.CHOOSING_PIECE_NEW_CELL;
                    if (this.gameMode == this.mode.BOT_VS_BOT || (this.gameMode == this.mode.PLAYER_VS_BOT && this.player == 2)) this.BOTaddPiece();
                    this.scene.information = "Choose the new position for the piece you want to move.";
                } else {
                    this.currentState = this.state.ADDING_PLAYER;
                    if (this.gameMode == this.mode.BOT_VS_BOT || (this.gameMode == this.mode.PLAYER_VS_BOT && this.player == 2)) this.BOTaddPlayer();
                }
                break;
            case this.state.CHOOSING_PIECE_NEW_CELL:
                this.currentState = this.state.ADDING_PLAYER;
                this.scene.information = "Choose a cell for one of your pieces.";
                if (this.gameMode == this.mode.BOT_VS_BOT || (this.gameMode == this.mode.PLAYER_VS_BOT && this.player == 2)) this.BOTaddPlayer();
                break;
            case this.state.ADDING_PLAYER:
                this.currentState = this.state.CHOOSING_MOVE_PIECE;
                this.nextPlayer();
                this.scene.information = "If you want to move a worker choose a cell with a worker, otherwise choose a cell to put one of your pieces.";
                if (this.gameMode == this.mode.BOT_VS_BOT || (this.gameMode == this.mode.PLAYER_VS_BOT && this.player == 2)) this.BOTchooseMovePiece();
                break;
            case this.state.WON_GAME:
                this.scene.information = "You won!";
                this.updateScore();
                this.freezePlayerTimes();
                this.currentState = this.state.WAITING_FOR_START;
                this.previousState = this.state.WON_GAME;
                break;
            case this.state.DRAW_GAME:
                this.scene.information = "Woops, no more possible moves! It is a draw!";
                this.freezePlayerTimes();
                this.currentState = this.state.WAITING_FOR_START;
                this.previousState = this.state.DRAW_GAME;
                break;
            case this.state.QUIT_GAME:
                this.nextPlayer();
                this.currentState = this.state.WON_GAME;
                this.nextState();
            default:
                break;
        }
    }

    updateScore() {
        switch (this.player) {
            case 1:
                this.player1.incrementScore();
                break;
            case 2:
                this.player2.incrementScore();
                break;
            default:
                break;
        }
    }

    pickingHandler(row, column) {
        if (this.gameMode == this.mode.PLAYER_VS_PLAYER || (this.gameMode == this.mode.PLAYER_VS_BOT && this.player == 1)) {
            this.cellHandler(row, column);
        }
    }

    cellHandler(row, column) {
        this.scene.error = "";
        switch (this.currentState) {
            case this.state.ADDING_FIRST_WORKER:
                this.addPiece(row, column);
                break;
            case this.state.ADDING_SECOND_WORKER:
                this.addPiece(row, column);
                break;
            case this.state.CHOOSING_MOVE_PIECE:
                this.isPieceCell(row, column);
                break;
            case this.state.CHOOSING_PIECE_NEW_CELL:
                this.movePiece(row, column);
                break;
            case this.state.ADDING_PLAYER:
                this.addPlayer(row, column);
                break;
            default:
                break;
        }
    }

    checkGameState() {
        var this_game = this;

        let boardString = this.parseBoardToPROLOG();
        var id = this.getCurrPlayerId();
        var command = "check_state(" + id + "," + boardString + ")";

        this.scene.MyServer.getPrologRequest(
            command,
            function (data) {
                if (data.target.response == "1") {
                    this_game.currentState = this_game.state.WON_GAME;
                } else if (data.target.response == "2") {
                    this_game.currentState = this_game.state.DRAW_GAME;
                }

                this_game.nextState();
            },
            function (data) {
                console.log("CONNECTION ERROR");
            }
        );
    }

    getInitialBoard () {
        var this_game = this;

        this.scene.MyServer.getPrologRequest(
            "initial_board",
            function (data) {
                if (data.target.response.length == 265) {
                    this_game.board = this_game.parseBoardToJS(data.target.response);
                    this_game.nextState();
                }
                else console.log(" > XERO-G: CONNECTION ERROR");

            },
            function (data) {
                console.log(" > XERO-G: CONNECTION ERROR");
            }
        );
    }

    addPiece(row, column) {
        var this_game = this;

        let boardString = this.parseBoardToPROLOG();
        var command = "add_piece(" + boardString + "," + row + "," + column + ")";

        this.scene.MyServer.getPrologRequest(
            command,
            function (data) {
                if (data.target.response[0] == "[") {
                    if (data.target.response.length == 265) {
                        this_game.board = this_game.parseBoardToJS(data.target.response);
                        this_game.moves.push(new MyMove("add", "red", [row, column], null, this_game.currentState, this_game.player));
                        this_game.board[row - 1][column - 1].setAnimation(0, 0, this_game.player);
                        this_game.nextState();
                    }
                    else console.log(" > XERO-G: CONNECTION ERROR");
                } else {
                    this_game.scene.error = "ERROR: " + data.target.response;
                    console.log(" > XERO-G: ERROR - " + data.target.response);
                }
            },
            function (data) {
                console.log(" > XERO-G: CONNECTION ERROR");
            }
        );
    }

    isPieceCell(row, column) {
        var this_game = this;

        let boardString = this.parseBoardToPROLOG();
        var command =
            "is_piece_cell(" + boardString + "," + row + "," + column + ")";

        this.scene.MyServer.getPrologRequest(
            command,
            function (data) {
                if (data.target.response == "1") {
                    this_game.pieceSavedRow = row;
                    this_game.pieceSavedColumn = column;

                    this_game.nextState(1);
                } else {
                    this_game.nextState(0);
                    this_game.cellHandler(row, column);
                }
            },
            function (data) {
                console.log(" > XERO-G: CONNECTION ERROR");
            }
        );
    }

    movePiece(row, column) {
        var this_game = this;

        let boardString = this.parseBoardToPROLOG();

        var command = "move_piece(" + boardString + "," + this.workerSavedRow + "," + this.workerSavedColumn + "," + row + "," + column + ")";

        this.scene.MyServer.getPrologRequest(
            command,
            function (data) {
                if (data.target.response[0] == "[") {
                    if (data.target.response.length == 265) {
                        this_game.board = this_game.parseBoardToJS(data.target.response);
                        this_game.moves.push(new MyMove("move", "red", [row, column], [this_game.pieceSavedRow, this_game.pieceSavedColumn], this_game.state.CHOOSING_MOVE_PIECE, this_game.player));
                        this_game.board[row - 1][column - 1].setAnimation(this_game.pieceSavedColumn, this_game.pieceSavedRow);
                        this_game.nextState();
                    }
                    else console.log(" > XERO-G: CONNECTION ERROR");
                } else {
                    this_game.scene.error = "ERROR: " + data.target.response;
                    console.log(" > XERO-G: ERROR - " + data.target.response);
                }
            },
            function (data) {
                console.log(" > XERO-G: CONNECTION ERROR");
            }
        );
    }

    addPlayer(row, column) {
        var this_game = this;

        let boardString = this.parseBoardToPROLOG();
        var id = this.getCurrPlayerId();
        var command = "add_player(" + boardString + "," + row + "," + column + "," + id + ")";

        this.scene.MyServer.getPrologRequest(
            command,
            function (data) {
                if (data.target.response[0] == "[") {
                    if (data.target.response.length == 265) {
                        this_game.board = this_game.parseBoardToJS(data.target.response);
                        this_game.moves.push(new MyMove("add", this_game.getCurrPlayerId(), [row, column], null, this_game.previousState, this_game.player));
                        this_game.board[row - 1][column - 1].setAnimation();
                        this_game.checkGameState();
                    }
                    else console.log(" > XERO-G: CONNECTION ERROR");
                } else {
                    this_game.scene.error = "ERROR: " + data.target.response;
                    console.log(" > XERO-G: ERROR - " + data.target.response);
                }
            },
            function (data) {
                console.log(" > XERO-G: CONNECTION ERROR");
            }
        );
    }

    BOTaddPiece() {
        var this_game = this;

        let boardString = this.parseBoardToPROLOG();

        var cell = [];

        var command = "add_piece_bot(" + boardString + ")";

        var flag = false;

        this.scene.MyServer.getPrologRequest(
            command,
            function (data) {
                cell = this_game.parseCellToJS(data.target.response);
                this_game.cellHandler(cell[0], cell[1]);
            },
            function (data) {
                console.log(" > XERO-G: CONNECTION ERROR");
            }
        );
    }

    BOTchooseMovePiece() {
        var this_game = this;

        var command = "choose_move_piece_bot";

        var toMove = Math.round(Math.random());

        if (toMove) {
            var this_game = this;
            let boardString = this.parseBoardToPROLOG();
            var cell = [];
            var command = "get_piece_bot(" + boardString + ")";

            this.scene.MyServer.getPrologRequest(
                command,
                function (data) {
                    cell = this_game.parseCellToJS(data.target.response);
                    this_game.pieceSavedRow = cell[0];
                    this_game.pieceSavedColumn = cell[1];

                    this_game.nextState(1);
                },
                function (data) {
                    console.log(" > XERO-G: CONNECTION ERROR");
                }
            );
        } else {
            this_game.nextState(0);
        }
    }

    BOTaddPlayer() {
        var this_game = this;
        let boardString = this.parseBoardToPROLOG();

        var cell = [];
        var command = "add_player_bot(" + boardString + ")";
        var flag = false;

        this.scene.MyServer.getPrologRequest(
            command,
            function (data) {
                cell = this_game.parseCellToJS(data.target.response);
                this_game.cellHandler(cell[0], cell[1]);
            },
            function (data) {
                console.log(" > XERO-G: CONNECTION ERROR");
            }
        );
    }

    parseBoardToJS(stringBoard) {

        var numbersBoard = [];
        var i = 0;
        for (let rows = 0; rows < 11; rows++) {
            var numbersLine = [];
            var column = 0;
            while (column != 11) {
                if (stringBoard[i] != "[" && stringBoard[i] != "," && stringBoard[i] != "]") {
                    numbersLine.push(stringBoard[i]);
                    column++;
                }
                i++;
            }
            numbersBoard.push(numbersLine);
        }

        var board = [];
        for (var i = 0; i < numbersBoard.length; i++) {
            var line = [];
            for (var j = 0; j < numbersBoard[i].length; j++) {
                line.push(new MyPiece(this.scene, j, i, numbersBoard[i][j]));
            }
            board.push(line);
        }

        return board;
    }

    parseCellToJS(stringList) {
        let rowString, columnString;

        if (stringList[2] != ",") {
            rowString = stringList[1] + stringList[2];

            if (stringList[5] != "]") {
                columnString = stringList[4] + stringList[5];
            } else {
                columnString = stringList[4];
            }
        } else {
            rowString = stringList[1];

            if (stringList[4] != "]") {
                columnString = stringList[3] + stringList[4];
            } else {
                columnString = stringList[3];
            }
        }

        row = parseInt(rowString);
        column = parseInt(columnString);

        return [row, column];
    }

    parseBoardToPROLOG() {
        var boardString = "";
        boardString = boardString + "[";

        for (let i = 0; i < this.board.length; i++) {
            boardString = boardString + "[";

            for (let j = 0; j < this.board[i].length; j++) {
                var elem;

                switch (this.board[i][j].type) {
                    case "0":
                        elem = "empty";
                        break;
                    case "1":
                        elem = "1";
                        break;
                    case "2":
                        elem = "2";
                        break;
                    default:
                        break;
                }

                boardString = boardString + elem;
                if (j != this.board[i].length - 1) boardString = boardString + ",";
            }

            boardString = boardString + "]";
            if (i != this.board.length - 1) boardString = boardString + ",";
        }

        boardString = boardString + "]";

        return boardString;
    }
}
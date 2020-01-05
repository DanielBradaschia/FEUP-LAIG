/**
* MyXeroG
* @constructor
*/
class MyXeroG extends CGFobject {
    constructor(scene) {
        super(scene);
        this.gameSequence = new MyCycle(this.scene);
        this.animator = new MyAnimator(this.scene);
        this.gameboard = new MyGameBoard(this.scene);
        this.sideboard1 = new MyBoard2(this.scene, 1); 
        this.sideboard2 = new MyBoard2(this.scene, -1);

        this.boardCenter = [3, 3.2, 2];
        this.turn = 0;
        this.move = [];
        this.pause = false;

        this.gameRunning = false;
        this.videoRunning = false;

        this.pieces = [];
        this.oldPieces = [];

        this.initialmoves = 0;
        this.turnBegin;
        this.turnEnd;
        this.flag=0;
    }

    logPicking() {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (let i = 0; i < this.scene.pickResults.length; i++) {
                    let obj = this.scene.pickResults[i][0];
                    if (obj) {
                        let customId = this.scene.pickResults[i][1];
                        let row = (customId - 1) % 6 + 1;
                        let col = Math.floor((customId - 1) / 6) + 1;
                        
                        if(this.initialmoves <= 2)
                        {
                            row = 1;
                        }
                        if ((this.initialmoves > 2 && this.initialmoves <= 5 && this.flag==0) || (this.initialmoves==5 && this.flag==1) )
                        {
                            row = 6;
                            if(this.initialmoves==5 && this.flag==1)
                            {
                                row = (customId - 1) % 6 + 1;
                            }
                        }
                        if (this.gameSequence.checkMove([row, col]) && this.initialmoves != 2 && this.initialmoves != 5 && this.initialmoves != 6) {
                            this.turnBegin = performance.now();                            
                            this.playInitialPieces([row, col, this.turn]);    
                            this.initialmoves += 1;
                            this.turnEnd = performance.now();
                        }
                        else if (this.gameSequence.checkMove([row, col]) && (this.initialmoves == 2 || this.initialmoves == 5 || this.initialmoves == 6)){
                            this.turnBegin = performance.now();
                            this.playPiece([row, col, this.turn]);
                            if (this.initialmoves == 2) 
                            {
                                this.initialmoves+=1;
                            }
                            else if (this.initialmoves == 5) 
                            {
                                this.initialmoves+=1;
                            }
                            this.turnEnd = performance.now();
                        }
                        console.log("Player " + this.turn + " Time: " + (this.turnEnd - this.turnBegin) / 1000);
                        this.pause = true;
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    update(t) {
        this.animator.update(t);
    }


    //Displays the game according with it's state
    display() {
        this.gameboard.display();
        this.sideboard1.display();
        this.sideboard2.display();
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].display();
        }
    }

    playPiece(move) {
        this.scene.setPickEnabled(false); //Disables picking

        this.gameSequence.addMove(move);

        setTimeout(() => {
            this.turn = Math.abs(this.turn - 1);
            this.scene.setPickEnabled(true); }, 1500); //Change turn and enables picking after animation has finished
      
        let animation = new KeyFrameAnimation(this.scene); // creates an animation to be used in a piece
        this.animator.addAnimation(animation);

        let piece = new MyPiece(this.scene, move[0], move[1], move[2], animation); //Creates a piece
        this.pieces.push(piece);
    }


    playInitialPieces(move) {
        this.scene.setPickEnabled(false); //Disables picking

        this.gameSequence.addMove(move);

        setTimeout(() => {
            this.scene.setPickEnabled(true); }, 1500); //enables picking after animation has finished
      
        let animation = new KeyFrameAnimation(this.scene); // creates an animation to be used in a piece
        this.animator.addAnimation(animation);

        let piece = new MyPiece(this.scene, move[0], move[1], move[2], animation); //Creates a piece
        this.pieces.push(piece);
    }

    //Removes previous move
    undoMove() {
        if (this.gameSequence.sequence.length > 0) {
            this.gameSequence.undoMove();
            this.pieces.pop();
            this.animator.removeAnimation();

            if(this.initialmoves >= 1 && this.initialmoves <= 6)
            {
                this.initialmoves -= 1;
                if(this.initialmoves == 5)
                {
                    this.flag=1;
                    this.turn = Math.abs(this.turn - 1);
                }
                else if(this.initialmoves==2)
                {
                    this.turn = Math.abs(this.turn - 1);
                }
            }
            else
            {
                this.turn = Math.abs(this.turn - 1);
            }
        }
    }

    //Clears the board to it's initial state
    clearGame() {
        this.turn = 0;
        this.gameRunning = false;
        this.pieces = [];
        this.animator.clear();
        this.gameSequence.clear();
    }


    playVideoPiece(move) {

        this.gameSequence.addMove(move);
        
        let animation = new KeyFrameAnimation(this.scene); // creates an animation to be used in a piece
        
        this.animator.addAnimation(animation); // adds animation to array of animations
        let piece = new MyPiece(this.scene, move[0], move[1], move[2], animation); //Creates a piece
        this.pieces.push(piece); // adds piece to array of pieces
    }

    //Plays a video of the previous game
    async playVideo() {

        this.videoRunning = true;

        this.pieces = [];
        this.animator.clear();

        if (this.gameRunning == true)
            alert("Quit game to watch movie!");
        else {
            if (this.gameSequence.oldSequence.length > 0) {
                console.log(this.gameSequence.oldSequence.length);
                let isPlayed = [];

                for (let k = 0; k < this.gameSequence.oldSequence.length; k++) {
                    await new Promise(r => setTimeout(r, 600));
                    this.playVideoPiece(this.gameSequence.oldSequence[k]);
                    await new Promise(r => setTimeout(r, 4000)); 
                }
            }
        }
        console.log("Ended video");
        this.videoRunning = false;
    }
}

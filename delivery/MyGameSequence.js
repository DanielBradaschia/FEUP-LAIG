/**
* MyGameSequence
* @constructor
*/
class MyGameSequence extends CGFobject {
    constructor(scene) {
        super(scene);
        this.sequence = [];
        this.oldSequence = [];

    }

    undoMove() {
        this.sequence.pop();
    }

    addMove(move){
        this.sequence.push(move);
    }

    checkMove(move) {
        for (let i = 0; i < this.sequence.length ; i++) {
            if (this.sequence[i][0] == move[0] && this.sequence[i][1] == move[1])
                return false;
        }
        return true;
    }

    clear() {
        this.oldSequence = this.sequence;
        this.sequence = [];
    }
}
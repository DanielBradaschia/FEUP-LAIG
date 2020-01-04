/**
* MyPiece
* @constructor
*/
class MyPiece extends CGFobject {
    constructor(scene, row, col, turn, animation) {
        super(scene);
        this.row = row;
        this.col = col;
        this.turn = turn;
        this.animation = animation;

        this.temp;
        this.turn == 0 ? this.temp = 1 : this.temp = -1;

        this.ship = new MyShip(this.scene);
        this.boardCenter = [3, 3.2, 2];

        this.pieceMaterial = new CGFappearance(this.scene);
        this.pieceMaterial.setShininess(76.8);
        this.pieceMaterial.setAmbient(0.0215, 0.1745, 0.0215, 0.55);
        this.pieceMaterial.setDiffuse(0.07568, 0.61424, 0.07568, 0.55);
        this.pieceMaterial.setSpecular(0.633, 0.727811, 0.633, 0.55);
        this.pieceMaterial.setEmission(0.18, 0.18, 0.18, 0.1);

        this.developAnimation();
        
    }

    developAnimation() {
        let frame1 = [];
        frame1.push(1);

        let trans = [0, 0.15, 0];
        frame1.push(trans);

        let rot = [0, 0, 0];
        frame1.push(rot);

        let scale = [1, 1, 1];
        frame1.push(scale);

        this.animation.keyFrames.push(frame1);
      
      
        /*let frame1 = [];
        frame1.push(1);

        let trans = [0, 0.5, 0];
        frame1.push(trans);

        let rot = [0, 0, 0];
        frame1.push(rot);

        let scale = [1, 1, 1];
        frame1.push(scale);

        this.animation.keyFrames.push(frame1);

        let frame2 = [];
        frame2.push(2);

        trans = [0, 0.5, (1.53 * this.temp)];
        frame2.push(trans);

        rot = [0, 0, 0];
        frame2.push(rot);

        scale = [1, 1, 1];
        frame2.push(scale);

        this.animation.keyFrames.push(frame2);
        
        let frame3 = [];
        frame3.push(3);

        trans = [parseFloat(-1.05 + (0.3 * (this.row - 1))).toFixed(3), 0.5, parseFloat((1.53 * this.temp) + 1.05 - (0.3 * (this.col - 1))).toFixed(3)];
        frame3.push(trans);

        rot = [0, 0, 0];
        frame3.push(rot);

        scale = [1, 1, 1];
        frame3.push(scale);

        this.animation.keyFrames.push(frame3);
        
        let frame4 = [];
        frame4.push(4);

        trans = [parseFloat(-1.05 + (0.3 * (this.row - 1))).toFixed(3), 0, parseFloat((1.53 * this.temp) + 1.05 - (0.3 * (this.col - 1))).toFixed(3)];
        frame4.push(trans);

        rot = [0, 0, 0];
        frame4.push(rot);

        scale = [1, 1, 1];
        frame4.push(scale);

        this.animation.keyFrames.push(frame4);*/
    }

    display() {
        if (this.scene.pickMode == false) {


            this.scene.pushMatrix();
            this.pieceMaterial.apply();
            this.animation.apply();
            this.scene.translate(-0.65 + (this.row - 1) * 0.2487505, 0, 0.62 - (this.col - 1) * 0.2487505);
            this.scene.rotate(Math.PI / 6, 0, 1, 0);
            this.scene.scale(0.15, 0.1, 0.15);
           
            /*if (this.turn == 1)
                this.scene.translate(0, 0.15, 1.5);
            else
                this.scene.translate(0, 0.15, -1.5);

            this.scene.rotate(Math.PI / 6, 0, 1, 0);
            this.scene.scale(0.13, 0.1, 0.13);*/

            this.ship.display();
            this.scene.popMatrix();
        }
    }

}
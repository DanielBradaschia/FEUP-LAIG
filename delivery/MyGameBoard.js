/**
* MyGameBoard
* @constructor
*/
class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.cube = new MyUnitCube(this.scene);
        this.square = new MySquarePiece(this.scene);

        this.boardMaterial = new CGFappearance(this.scene);
        this.boardMaterial.setShininess(0.078125);
        this.boardMaterial.setAmbient(0.02, 0.02, 0.02, 1);
        this.boardMaterial.setDiffuse(0.01, 0.01, 0.01, 1);
        this.boardMaterial.setSpecular(0.4, 0.4, 0.4, 1);
        this.boardMaterial.setEmission(0.1, 0.1, 0.1, 1);	 									

        this.tileMaterial = new CGFappearance(this.scene);
        this.tileMaterial.setShininess(0.25);
        this.tileMaterial.setAmbient(0.0, 0.0, 0.0, 1);
        this.tileMaterial.setDiffuse(0.5, 0.0, 0.0, 1);
        this.tileMaterial.setSpecular(0.7, 0.6, 0.6, 1);
        this.tileMaterial.setEmission(0.7445, 0.064, 0.0764, 1);
    }


    display() {


        this.tileMaterial.apply();
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                this.scene.pushMatrix();
                this.scene.translate(-0.65 + j * 0.2487505, 0.10101, 0.62 - i * 0.2487505);
                this.scene.scale(0.30, 0.02, 0.30);
                this.scene.registerForPick(i * 6 + j + 1, this.square);
                this.square.display();
                this.scene.popMatrix();

            }
        }

        this.boardMaterial.apply();
        if (this.scene.pickMode == false) {
            this.scene.pushMatrix();
            this.scene.scale(2.3, 0.2, 2.3);
            this.cube.display();
            this.scene.popMatrix();
        }
    }


}
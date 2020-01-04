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
        this.boardMaterial.setShininess(1.0);
        this.boardMaterial.setAmbient(0.51, 0.41, 0.19, 1);
        this.boardMaterial.setDiffuse(0.51, 0.41, 0.19, 1);
        this.boardMaterial.setSpecular(0.51, 0.41, 0.19, 1);
        this.boardMaterial.setEmission(0.51, 0.41, 0.19, 1);

        this.tileMaterial = new CGFappearance(this.scene);
        this.tileMaterial.setShininess(1.0);
        this.tileMaterial.setAmbient(0.6445, 0.164, 0.164, 1);
        this.tileMaterial.setDiffuse(0.6445, 0.164, 0.164, 1);
        this.tileMaterial.setSpecular(0.6445, 0.164, 0.164, 1);
        this.tileMaterial.setEmission(0.6445, 0.164, 0.164, 1);

        this.blackMaterial = new CGFappearance(this.scene);
        this.blackMaterial.setShininess(1.0);
        this.blackMaterial.setAmbient(0.1, 0.1, 0.1, 0.1);
        this.blackMaterial.setDiffuse(0.1, 0.1, 0.1, 0.1);
        this.blackMaterial.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.blackMaterial.setEmission(0.1, 0.1, 0.1, 0.1);

        this.whiteMaterial = new CGFappearance(this.scene);
        this.whiteMaterial.setShininess(0.1);
        this.whiteMaterial.setAmbient(0.9, 0.9, 0.9, 0.1);
        this.whiteMaterial.setDiffuse(0.9, 0.9, 0.9, 0.1);
        this.whiteMaterial.setSpecular(0.9, 0.9, 0.9, 0.1);
        this.whiteMaterial.setEmission(0.9, 0.9, 0.9, 0.1);


    }


    display() {


        this.tileMaterial.apply();
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                this.scene.pushMatrix();
                this.scene.translate(-0.65 + j * 0.2487505, 0.10101, 0.62 - i * 0.2487505);
                this.scene.scale(0.30, 0.1, 0.30);
                this.scene.registerForPick(i * 6 + j + 1, this.square);
                this.square.display();
                this.scene.popMatrix();

            }
        }

        this.boardMaterial.apply();
        if (this.scene.pickMode == false) {
            this.scene.pushMatrix();
            this.scene.scale(2.2, 0.3, 2.2);
            this.cube.display();
            this.scene.popMatrix();
        }
    }


}
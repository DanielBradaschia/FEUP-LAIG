/**
* MyBoard2
* @constructor
*/
class MyBoard2 extends CGFobject {
    constructor(scene, mat) {
        super(scene);
        this.mat = mat;
        this.cube = new MyUnitCube(this.scene);
        this.ship1 = new MyShip(this.scene);
        this.ship2 = new MyShip(this.scene);
        this.ship3 = new MyShip(this.scene);

        this.boardMaterial = new CGFappearance(this.scene);
        this.boardMaterial.setShininess(0.078125);
        this.boardMaterial.setAmbient(0.02, 0.02, 0.02, 1);
        this.boardMaterial.setDiffuse(0.01, 0.01, 0.01, 1);
        this.boardMaterial.setSpecular(0.4, 0.4, 0.4, 1);
        this.boardMaterial.setEmission(0.1, 0.1, 0.1, 1);

        this.pieceMaterial = new CGFappearance(this.scene);
        this.pieceMaterial.setShininess(76.8);
        this.pieceMaterial.setAmbient(0.0215, 0.1745, 0.0215, 0.55);
        this.pieceMaterial.setDiffuse(0.07568, 0.61424, 0.07568, 0.55);
        this.pieceMaterial.setSpecular(0.633, 0.727811, 0.633, 0.55);
        this.pieceMaterial.setEmission(0.18, 0.18, 0.18, 0.1);

    }


    display() {



        if (this.scene.pickMode == false) {
            this.pieceMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(1.5*this.mat, 0.15, -0.5);
            this.scene.rotate(Math.PI / 8, 0, 1, 0);
            this.scene.scale(0.15, 0.6, 0.15);
            this.ship1.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(1.5 * this.mat, 0.15, 0);
            this.scene.rotate(Math.PI / 8, 0, 1, 0);
            this.scene.scale(0.15, 0.4, 0.15);
            this.ship2.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(1.5 * this.mat, 0.15, 0.5);
            this.scene.rotate(Math.PI / 8, 0, 1, 0);
            this.scene.scale(0.15, 0.2, 0.15);
            this.ship3.display();
            this.scene.popMatrix();


            this.scene.pushMatrix();
            this.boardMaterial.apply();
            this.scene.translate(1.5*this.mat, 0, 0);
            this.scene.rotate(Math.PI /2, 0, 1, 0);
            this.scene.scale(1.40, 0.3, 0.4);
            this.cube.display();
            this.scene.popMatrix();
        }
    }


}
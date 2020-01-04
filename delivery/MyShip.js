/**
* MyShip
* @constructor
*/
class MyShip extends CGFobject {
    constructor(scene) {
        super(scene);
		this.ship1 = new MyPyramid(this.scene, 3,3);

		this.blackMaterial = new CGFappearance(this);
        this.blackMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.blackMaterial.setDiffuse(0, 0, 0, 1.0);
        this.blackMaterial.setSpecular(0, 0, 0, 1.0);
        this.blackMaterial.setShininess(10.0);
    }
    display() {
        this.scene.pushMatrix();
		this.ship1.display();
		this.scene.popMatrix();
    }

    
}
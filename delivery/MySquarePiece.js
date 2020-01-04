/**
* MySquarePiece
* @constructor
*/
class MySquarePiece extends CGFobject {
    constructor(scene) {
        super(scene);
		this.side = new MyRectangle(this.scene, -0.5, 0.5, -0.5, 0.5);
    }
    display() {

		//top side
        this.scene.pushMatrix();
		this.scene.translate(0, 0.5, 0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(0.765, 0.765, 1);
		this.side.display();
		this.scene.popMatrix();

		//bottom side
		this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.scene.scale(0.765, 0.765, 1);
		this.side.display();
		this.scene.popMatrix();


		//the other sides
		this.scene.pushMatrix();
		this.scene.translate(0, 0.25, 0.3825);
		this.scene.scale(0.765, 0.5, 1);
		this.side.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0.3825, 0.25, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.scale(0.765, 0.5, 1);
		this.side.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0, 0.25, -0.3825);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.scale(0.765, 0.5, 1);
		this.side.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-0.3825, 0.25, 0);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.scene.scale(0.765, 0.5, 1);
		this.side.display();
		this.scene.popMatrix();



    }

    
}
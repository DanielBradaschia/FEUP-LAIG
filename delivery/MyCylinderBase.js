/**
* MyCylinderBase
* @constructor
*/
class MyCylinderBase extends CGFobject {
    constructor(scene, slices, radius) {
        super(scene);
        this.slices = slices;
        this.radius = radius;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

		let angleDiff = 2*Math.PI / this.slices;
		let ang = 0;

		let sa;
		let ca;
		let sat;
		let cat;

		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);


		for(let i = 0; i <= this.slices; i++) {
			
			sa = Math.sin(ang) * this.radius;
			ca = Math.cos(ang) * this.radius;
			sat = Math.sin(ang) * 0.5;
			cat = Math.cos(ang) * 0.5;

			this.vertices.push(ca, sa, 0);
			this.normals.push(0, 0, 1);
			this.texCoords.push(cat, sat);

			ang += angleDiff;
		}

		for(let i = 0; i < this.slices; i++) {
			this.indices.push(0, i+1, i+2);
		}
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 4 + Math.round(16 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }

}
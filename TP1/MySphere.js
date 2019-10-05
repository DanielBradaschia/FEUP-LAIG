/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MySphere extends CGFobject {
    /**
     * Builds a MySphere object
     *
     * @param {CGFscene} scene CGFscene
     * @param {Number} radius number of the sphere radius
     * @param {Number} slices number of slices
     * @param {Number} stacks number of stacks
     */
    constructor(scene, id, radius, slices, stacks) {
        super(scene);

        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.SemiSphere_1 = new MySemiSphere(this.scene, slices, stacks);
        this.SemiSphere_2 = new MySemiSphere(this.scene, slices, stacks);

        this.initBuffers();
    };

    display() {

        this.scene.pushMatrix();
        this.scene.scale(this.radius, this.radius, this.radius);
        this.SemiSphere_1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(this.radius, this.radius, this.radius);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.SemiSphere_2.display();
        this.scene.popMatrix();
    };

    updateTexCoords (s, t) {
        this.SemiSphere_1.updateTexCoords(s, t);
        this.SemiSphere_2.updateTexCoords(s, t);
    };

    
};
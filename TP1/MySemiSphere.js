/**
 * MySemiSphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MySemiSphere extends CGFobject {
    /**
     * Builds a MySemiSphere object
     *
     * @param {CGFscene} scene CGFscene
     * @param {Number} slices number of slices
     * @param {Number} stacks number of stacks
     */
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    };

    /**
     * Initializes vertices, indices, normals and texture coordinates.
     */
    initBuffers() {

        var alpha = 2 * Math.PI / this.slices;

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];
        this.init_texCoords=[];

        var alpha = 2 * Math.PI / this.slices;
        var beta = (Math.PI / 2) / this.stacks;

        for (let i = 0; i <= this.stacks; i++) {
            for (let j = 0; j <= this.slices; j++) {
                this.vertices.push(Math.cos(alpha * j) * Math.cos(beta * i), Math.sin(alpha * j) * Math.cos(beta * i), Math.sin(beta * i));
                this.normals.push(Math.cos(alpha * j) * Math.cos(beta * i), Math.sin(alpha * j) * Math.cos(beta * i), Math.sin(beta * i));
                this.texCoords.push(j * 1 / this.slices, i * 1 / this.stacks);
            }
        }

        for (let k = 0; k < this.stacks; k++) {
            for (let l = 0; l < this.slices; l++) {
                this.indices.push(k * (this.slices + 1) + l, k * (this.slices + 1) + 1 + l, (k + 1) * (this.slices + 1) + l);
                this.indices.push(k * (this.slices + 1) + 1 + l, (k + 1) * (this.slices + 1) + 1 + l, (k + 1) * (this.slices + 1) + l);
            }
        }



        this.init_texCoords=this.texCoords;
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    updateTexCoords(s, t) {
        for (let i = 0; i < this.init_texCoords.length; i += 2) {
          this.texCoords[i] = this.init_texCoords[i] / s;
          this.texCoords[i + 1] = this.init_texCoords[i + 1] / t;
        }
        this.updateTexCoordsGLBuffers();
    };
};
/**
 * MyTorus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTorus extends CGFobject {
    /**
     * Builds a MyTorus object
     *
     * @param {CGFscene} scene CGFscene
     * @param {Number} innerRadius value of the inner radius
     * @param {Number} outerRadius value of the outer radius
     * @param {Number} slices number of slices
     * @param {Number} loops number of loops
     */
    constructor(scene, id, innerRadius, outerRadius, slices, loops) {
        super(scene);

        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

    /**
     * Initializes vertices, indices, normals and texture coordinates.
     */
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var n = (this.outerRadius + this.innerRadius) / 2;
        var vertcount = 0;

        var alpha = 2 * Math.PI / this.slices;
        var beta = 2 * Math.PI / this.loops;

        for (let i = 0; i <= this.slices; i++) {
            for (let j = 0; j <= this.loops; j++) {

                let x = (this.outerRadius + this.innerRadius * Math.cos(j * beta)) * Math.cos(i * alpha);
                let y = (this.outerRadius + this.innerRadius * Math.cos(j * beta)) * Math.sin(i * alpha);
                let z = this.innerRadius * Math.sin(j * alpha)

                let x1 = (this.innerRadius * Math.cos(j * beta)) * Math.cos(i * alpha);
                let y1 = (this.innerRadius * Math.cos(j * beta)) * Math.sin(i * alpha);
                let z1 = this.innerRadius * Math.sin(j * alpha)

                this.vertices.push(x, y, z);
                this.normals.push(x1, y1, z1);

                let x_coord = Math.acos(x / this.innerRadius) / (2 * Math.PI);
                let y_coord = 2 * Math.PI * Math.acos(z / (this.innerRadius + this.outerRadius * Math.cos(2 * Math.PI * x_coord)));

                /*
                y_coord = i / this.slices;
                x_coord = (j % (this.loops + 1)) / this.slices;
                */
               
                this.texCoords.push(x_coord, y_coord);

                vertcount++;

                if (i > 0 && j > 0) {
                    this.indices.push(vertcount - this.loops - 2, vertcount - 2, vertcount - 1);
                    this.indices.push(vertcount - 2, vertcount - this.loops - 2, vertcount - this.loops - 3);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};
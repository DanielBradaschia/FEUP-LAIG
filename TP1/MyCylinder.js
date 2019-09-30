/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject {
    /**
     * Builds a MyCylinder object
     *
     * @param {CGFscene} scene CGFscene
     * @param {Number} slices number of slices
     * @param {Number} stacks number of stacks
     * @param {Number} baseRadius 
     * @param {Number} topRadius
     * @param {Number} height
     */
    constructor(scene, id, slices, stacks, baseRadius, topRadius, height) {
        super(scene);
    
        this.slices = slices;
        this.stacks = stacks;

        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.height = height;
    
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

        var x = 0;
        var y = 0;
    
        for (let i = 0; i <= this.stacks; i++) {

            var z = (i * (this.height / this.stacks) / this.stacks);
            var inc = (i * ((this.topRadius - this.baseRadius) / this.stacks) + this.baseRadius);

            for (let j = 0; j < this.slices; j++) {
                this.vertices.push(inc * Math.cos(j * alpha), inc * Math.sin(j * alpha), i * (this.height / this.stacks));
                this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), 0);
                this.texCoords.push(x, y);
                x += 1/this.slices;
            }
            x = 0;
            y += 1/this.stacks;
        }
    
        for (let k = 0; k < this.stacks; k++) {
            for (let l = 0; l < this.slices; l++) {
                this.indices.push(this.slices * k + l, this.slices * k + l + 1, this.slices * (k + 1) + l);
                this.indices.push(this.slices * k + l + 1, this.slices * k + l, this.slices * (k + 1) + l);
                if (l != (this.slices - 1))
                {
                    this.indices.push(this.slices * (k + 1) + l + 1, this.slices * (k + 1) + l, this.slices * k + l + 1);
                    this.indices.push(this.slices * (k + 1) + l, this.slices * (k + 1) + l + 1, this.slices * k + l + 1);
                } else
                {
                    this.indices.push(this.slices * k, this.slices * k + l + 1, this.slices * k + l);
                    this.indices.push(this.slices * k + l + 1, this.slices * k, this.slices * k + l);
                }
            }
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
    };
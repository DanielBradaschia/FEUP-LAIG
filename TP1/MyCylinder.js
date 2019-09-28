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
     * @param {Boolean} outside
     * @param {Boolean} half
     * @param {Number} minS minimum s texture coordinate
     * @param {Number} maxS maximum s texture coordinate
     * @param {Number} minT minimum t texture coordinate
     * @param {Number} maxT maximum t texture coordinate
     */
    constructor(scene, slices, stacks, outside = true, half = false, minS = 0, maxS = 1, minT = 0, maxT = 1) {
        super(scene);
    
        this.slices = slices;
        this.stacks = stacks;
    
        this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;
        this.outside = outside;
        this.half = half;
    
        this.initBuffers();
    };
    
    /**
     * Initializes vertices, indices, normals and texture coordinates.
     */
    initBuffers() {
        var alpha = 2 * Math.PI / this.slices;
        if (this.half == true)
            alpha = Math.PI / this.slices;
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];
    
        var z = 0;
        var incS = (this.maxS - this.minS) / this.slices;
        var incT = (this.maxT - this.minT) / this.stacks;
    
        for (let i = 0; i <= this.stacks; i++) {
            for (var j = 0; j <= this.slices; j++) {
                this.vertices.push(Math.cos(j * alpha), Math.sin(j * alpha), z);
    
                if (this.outside == true)
                    this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), 0);
                else
                    this.normals.push(-Math.cos(j * alpha), -Math.sin(j * alpha), 0);
    
                this.texCoords.push(this.maxS - incS * j, this.minT + incT * i);
            }
    
            z += 1 / this.stacks;
        }
    
        var ind = 0;
    
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j <= this.slices; j++) {
                if (j != this.slices) {
                    if (this.outside == true) {
                        this.indices.push(ind, ind + 1, ind + this.slices + 1);
                        this.indices.push(ind + this.slices + 1, ind + 1, ind + this.slices + 2);
                    } else {
                        this.indices.push(ind, ind + this.slices + 1, ind + 1);
                        this.indices.push(ind + this.slices + 1, ind + this.slices + 2, ind + 1);
                    }
                }
                ind++;
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
    };
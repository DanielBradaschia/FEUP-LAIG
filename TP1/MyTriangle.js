/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
    constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
            this.x1, this.y1, this.z1,	//0
            this.x2, this.y2, this.z2,	//1
            this.x3, this.y3, this.z3	//2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            2, 1, 0
        ];
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
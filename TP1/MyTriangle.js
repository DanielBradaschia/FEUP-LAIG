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

        this.point_1 = [x1,y1,z1];
        this.point_2 = [x2,y2,z2];
        this.point_3 = [x3,y3,z3];

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
    updateTexCoords(s, t) {
        this.disp1_p2 = Math.sqrt(Math.pow((this.point_2[0] - this.point_1[0]), 2) +
            Math.pow((this.point_2[1] - this.point_1[1]), 2) +
            Math.pow((this.point_2[2] - this.point_1[2]), 2));

        this.disp3_p1 = Math.sqrt(Math.pow((this.point_1[0] - this.point_3[0]), 2) +
            Math.pow((this.point_1[1] - this.point_3[1]), 2) +
            Math.pow((this.point_1[2] - this.point_3[2]), 2));

        this.disp2_p3 = Math.sqrt(Math.pow((this.point_2[0] - this.point_3[0]), 2) +
            Math.pow((this.point_2[1] - this.point_3[1]), 2) +
            Math.pow((this.point_2[2] - this.point_3[2]), 2));

        var angBt = Math.acos((Math.pow(this.disp2_p3, 2) - Math.pow(this.disp3_p1, 2) + Math.pow(this.disp1_p2, 2)) / (2 * this.disp2_p3 * this.disp1_p2));

        var aux = this.disp2_p3 * Math.sin(angBt);

        this.texCoords = [0, aux / t,
            this.disp1_p2 / s, aux / t,
            (this.disp1_p2 - this.disp2_p3 * Math.cos(angBt)) / s, (aux - this.disp2_p3 * Math.sin(angBt)) / t
        ];

        this.updateTexCoordsGLBuffers();
    };
}
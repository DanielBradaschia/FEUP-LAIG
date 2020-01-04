/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
            //Top Face
            0.5, 0.5, 0.5,      //0 0
            0.5, 0.5, -0.5,     //1 1
            -0.5, 0.5, -0.5,    //2 2
            -0.5, 0.5, 0.5,     //3 3

            //Front Face
            0.5, 0.5, 0.5,      //4 0
            -0.5, 0.5, 0.5,     //5 3
            -0.5, -0.5, 0.5,    //6 7
            0.5, -0.5, 0.5,     //7 4

            //Right Face
            0.5, 0.5, 0.5,      //8 0
            0.5, -0.5, 0.5,     //9 4
            0.5, -0.5, -0.5,    //10 5
            0.5, 0.5, -0.5,     //11 1

            //Back Face
            0.5, 0.5, -0.5,     //12 1
            -0.5, 0.5, -0.5,     //13 2
            -0.5, -0.5, -0.5,    //14 6
            0.5, -0.5, -0.5,     //15 5

            //Left Face
            -0.5, 0.5, -0.5,    //16 2
            -0.5, 0.5, 0.5,     //17 3
            -0.5, -0.5, 0.5,      //18 7
            -0.5, -0.5, -0.5,    //19 6

            //Bottom Face
            0.5, -0.5, 0.5,     //20 4
            0.5, -0.5, -0.5,    //21 5
            -0.5, -0.5, -0.5,   //22 6
            -0.5, -0.5, 0.5     //23 7
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
             //Top Face
             1, 2, 0,
             2, 3, 0,
           
 
             //Front Face
             4, 5, 6,
             7, 4, 6,
            
 
             //Right Face
             11, 8, 9,
             10, 11, 9,
          
 
             //Back Face
             12, 15, 14,
             12, 14, 13,
            
 
             //Left Face
             17, 16, 19,
             17, 19, 18,
             
 
             //Bottom Face
             20, 23, 22,
             20, 22, 21
             
        ];

        this.normals = [
            //Top Face
            0, 1, 0,      //0 0
            0, 1, 0,     //1 1
            0, 1, 0,    //2 2
            0, 1, 0,     //3 3

            //Front Face
            0, 0, 1,      //4 0
            0, 0, 1,     //5 3
            0, 0, 1,    //6 7
            0, 0, 1,     //7 4

            //Right Face
            1, 0, 0,    //8 0
            1, 0, 0,    //9 4
            1, 0, 0,    //10 5
            1, 0, 0,    //11 1

            //Back Face
            0, 0, -1,   //12 1
            0, 0, -1,   //13 2
            0, 0, -1,    //14 6
            0, 0, -1,   //15 5

            //Left Face
            -1, 0, 0,   //16 2
            -1, 0, 0,   //17 3
            -1, 0, 0,     //18 7
            -1, 0, 0,    //19 6

            //Bottom Face
            0, -1, 0,   //20 4
            0, -1, 0,   //21 5
            0, -1, 0,   //22 6
            0, -1, 0   //23 7
            


        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
/**
* constructor of MyPlane object
* @constructor MyPlane
* @param {String} id    string of the id
*/
class MyPlane extends CGFobject {
    constructor(scene, id, uDiv, vDiv) {
        super(scene);
        this.uDiv = uDiv;
        this.vDiv = vDiv;
        this.controlvertexes;
        this.createControlVertexes();

        this.plane = this.makeSurface();
    }

    createControlVertexes() {
        this.controlvertexes =
            [	// U = 0
                [ // V = 0..1;
                    [-0.5, 0.0, -0.5, 1],
                    [0.5, 0.0, -0.5, 1]

                ],
                // U = 1
                [ // V = 0..1
                    [-0.5, 0.0, 0.5, 1],
                    [0.5, 0.0, 0.5, 1]
                ]
            ];

    }

    updateTexCoords() { }

    makeSurface() {
        var nurbsSurface = new CGFnurbsSurface(1, 1, this.controlvertexes);
        var obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);

        return obj;
    }

    display() {
        this.scene.pushMatrix();
        this.plane.display();
        this.scene.popMatrix();

    }
}
/**
* constructor of MyPlane object
* @constructor MyPlane
* @param {String} id    string of the id
*/

class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);
        const control_vertexes =
            [	// U0
                [
                    [-0.5, 0.0, 0.5, 1],	// V0
                    [-0.5, 0.0, -0.5, 1]	// V1
                ],
                //U1
                [
                    [0.5, 0.0, 0.5, 1],	// V0
                    [0.5, 0.0, -0.5, 1]		// V1
                ]
            ];

        let nurbs_surface = new CGFnurbsSurface(1, 1, control_vertexes);
        
        this.nurbs_object = new CGFnurbsObject(scene, npartsU, npartsV, nurbs_surface);
    };

    display() {
        this.nurbs_object.display();
    }

    setTexLengths(length_s, length_t) {

    }
}
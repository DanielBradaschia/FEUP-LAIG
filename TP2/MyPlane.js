/**
* constructor of MyPlane object
* @constructor MyPlane
* @param {String} id    string of the id
*/

class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.createControlVertexes(this.npartsU, this.npartsV);

        let nurbs_surface = new CGFnurbsSurface(this.npartsU, this.npartsV, this.controlVertexes);
        
        this.nurbs_object = new CGFnurbsObject(scene, 50, 50, nurbs_surface);
    };

    display() {
        this.nurbs_object.display();
    }

    setTexLengths(length_s, length_t) {

    }

    createControlVertexes(npartsU, npartsV) {
        var matrix = [];
        
        const step_U = 1.0 / npartsU;
        const step_V = 1.0 / npartsV;

        this.controlVertexes = [];

        for (let U = 0; U <= 1.0; U += step_U)
        {
            for (let V = 0; V <= 1.0; V += step_V)
            {
                matrix.push([-0.5 + U, 0.0, 0.5 - V, 1.0]);
            }
            this.controlVertexes.push(matrix);
            matrix = [];
        }
    }

    updateTexCoords(length_s, length_t) {}
}
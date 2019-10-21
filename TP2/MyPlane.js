/**
* constructor of MyPlane object
* @constructor MyPlane
* @param {String} id    string of the id
*/

class MyPlane extends CGFobject {
    constructor(npartsU, npartsV) {
        this.nU = npartsU;
        this.nV = npartsV;
        this.controlPoints = [];
        this.buildControlPoints(this.nU, this.nV);
        this.plane = this.createSurface(this.nU, this.nV, this.controlPoints);
        
    }

    display(){
        this.plane.display();
    }

    buildControlPoints(nU, nV){
        var matrix = [];
        const step_v = 1.0 / nV;
        const step_u = 1.0 / nU;

        for (let value_u = 0; value_u <= 1.0; value_u += step_u) {
            for (let value_v = 0; value_v <= 1.0; value_v += step_v) {
                matrix.push([-0.5 + value_u, 0.0, 0.5 - value_v, 1.0]);
            }
            this.controlPoints.push(matrix);
            matrix = [];
        }
    }

    createSurface(nU, nV, controlPoints){
        var nurbsSurface = new CGFnurbsSurface(nU, nV, controlPoints);

        var obj = new CGFnurbsObject(this.scene, 50, 50, nurbsSurface);

        return obj;
    }
}
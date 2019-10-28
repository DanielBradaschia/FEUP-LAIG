function Patch(scene, reference) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.npartsU = reference.npartsU;
    this.npartsV = reference.npartsV;
    this.pointU = reference.npointU;
    this.pointV = reference.npointV;

    this.buildControlPoints(reference.controlPoints);



    this.patch = this.makeSurface(this.pointU, this.pointV, this.npartsU, this.npartsV, this.controlPoints);

}

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.buildControlPoints = function (controlPoints) {
    var index = 0;
    var matrix = [];
    var length = controlPoints.length;
    this.controlPoints = [];

    while (true) {
        if (index == length) {
            break;
        }

        const element = controlPoints.splice(0, 1)[0];
        matrix.push(element);

        if (!(++index % (this.pointV + 1))) {
            this.controlPoints.push(matrix);
            matrix = [];
        }
    }
};


Patch.prototype.makeSurface = function (degreeU, degreeV, npartsU, npartsV, cP) {

    var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, cP);

    getSurfacePoint = function (u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    var nurbs = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface);
    return nurbs;
};


Patch.prototype.display = function () {
    this.scene.pushMatrix();
    this.patch.display();
    this.scene.popMatrix();

};

Patch.prototype.updateTexCoords = function (aS, aT) { }
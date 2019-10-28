function Cylinder2(scene, reference) {
    CGFobject.call(this, scene);

    this.slices = reference.slices;
    this.stacks = reference.stacks;
    this.height = reference.height;


    this.buildControlPoints(this.slices, this.stacks);


    this.scene = scene;
    primitive = {
        npointU: 2,
        npointV: 2,
        npartsU: 20,
        npartsV: 20,
        controlPoints: this.controlPoints
    };

    this.cylinder2 = new Patch(this.scene, primitive);
}



Cylinder2.prototype = Object.create(CGFobject.prototype);
Cylinder2.prototype.constructor = Cylinder2;

Cylinder2.prototype.buildControlPoints = function (slices, stacks) {
    var angle = (360 / slices) * Math.PI / 180;
    var step_z = 1 / stacks;
    this.controlPoints = [];

    for (let i = 0; i <= stacks; i++) {
        for (let j = 0; j <= slices; j++) {
            this.controlPoints.push([
                (0.5 * Math.cos(j * angle)),
                (0.5 * Math.sin(j * angle)),
                (0.5 - i * step_z)
            ]);
        }
        this.controlPoints.push([
            0.5,
            0,
            0.5 - i * step_z
        ]);
    }


}

Cylinder2.prototype.display = function () {
    this.scene.pushMatrix();
    this.cylinder2.display();
    this.scene.popMatrix();

};

Cylinder2.prototype.updateTexCoords = function (aS, aT) { }
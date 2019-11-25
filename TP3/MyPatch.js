class MyPatch extends CGFobject {
    constructor(scene, id, uPart, vPart, uDiv, vDiv, cPoints) {
        super(scene);
        this.uPart = uPart;
        this.vPart = vPart;
        this.uDiv = uDiv;
        this.vDiv = vDiv;
        this.controlPoints = cPoints;
        this.createControlVertexes();

        this.patch = this.makeSurface();
    }

    createControlVertexes() {
        var index = 0;
        var matrix = [];
        var length = this.controlPoints.length;
        this.cPoints = [];

        while (index != length) {
            const element = this.controlPoints.splice(0, 1)[0];
            matrix.push(element);

            if (!(++index % (this.vPart + 1))) {
                this.cPoints.push(matrix);
                matrix = [];
            }
        }
    }

    updateTexCoords() { }

    makeSurface() {
        var nurbsSurface = new CGFnurbsSurface(this.uPart, this.vPart, this.cPoints);
        var obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);

        return obj;
    }

    display() {
        this.scene.pushMatrix();
        this.patch.display();
        this.scene.popMatrix();

    }
}
class Cylinder2 extends CGFobject {
    constructor(scene, id, base, top, slices, stacks, height) {
        super(scene);

        this.top = top;
        this.base = base;
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;

        this.uDiv = slices;
        this.vDiv = stacks;
        this.uPart = 2;
        this.vPart = 9;
        this.initControlPoints();

        this.cylinder2 = this.makeSurface();
    }

    initControlPoints() {

        this.controlPoints = [
            [
                [0.0, -this.base, 0.0, 1.0],
                [-this.base, -this.base, 0.0, Math.sqrt(2) / 2.0],
                [-this.base, 0.0, 0.0, 1.0],
                [-this.base, this.base, 0.0, Math.sqrt(2) / 2.0],
                [0, this.base, 0.0, 1.0],
                [this.base, this.base, 0.0, Math.sqrt(2) / 2.0],
                [this.base, 0.0, 0.0, 1.0],
                [this.base, -this.base, 0.0, Math.sqrt(2) / 2.0],
                [0.0, -this.base, 0.0, 1.0]
            ],
            [
                [0.0, -this.top, this.height, 1.0],
                [-this.top, -this.top, this.height, Math.sqrt(2) / 2.0],
                [-this.top, 0.0, this.height, 1.0],
                [-this.top, this.top, this.height, Math.sqrt(2) / 2.0],
                [0, this.top, this.height, 1.0],
                [this.top, this.top, this.height, Math.sqrt(2) / 2.0],
                [this.top, 0.0, this.height, 1.0],
                [this.top, -this.top, this.height, Math.sqrt(2) / 2.0],
                [0.0, -this.top, this.height, 1.0]
            ]
        ];
    }

    makeSurface() {
        var nurbsSurface = new CGFnurbsSurface(this.uPart - 1, this.vPart - 1, this.controlPoints);
        var obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);

        return obj;
    }

    updateTexCoords() { }

    display() {
        this.scene.pushMatrix();
        this.cylinder2.display();
        this.scene.popMatrix();

    }
}
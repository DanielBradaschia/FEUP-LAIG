/**
* MyPiece
* @constructor
*/
class MyPlayer extends CGFobject {
    constructor(scene, x, z, type) {
        super(scene);
        this.x = x;
        this.z = z;
        this.type = type;

        this.setNodeId();
        this.setTransformMatrix();
        this.animationRef = null;

        this.minutes = "00";
        this.seconds = "00";
    }

    setNodeId() {
        switch (this.type) {
            case '1':
                this.nodeId = "Piece1";
                break;
            case '2':
                this.nodeId = "Piece2";
                break;
            case '3':
                this.nodeId = "Piece3";
                break;
            default:
                this.nodeId = null;
                break;
        }
    }
}
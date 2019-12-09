/**
* MyPiece
* @constructor
*/
class MyPiece extends CGFobject {
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

    setTransformMatrix() {
        this.transformMatrix = mat4.create();
        mat4.identity(this.transformMatrix);
        mat4.translate(this.transformMatrix, this.transformMatrix, [15 + this.x, 5.3, 15 + this.z]);
        mat4.rotate(this.transformMatrix, this.transformMatrix, Math.PI * -90 / 180, [1, 0, 0]);
    }

    setAnimation (initialX, initialZ, player) {
        switch (this.type) {
            case "1":
                var initialPoint = [28.5 - (15 + this.x), -(20 - (15 + this.z)), 0];
                var midPoint1 = [28.5 - (15 + this.x), -(20 - (15 + this.z)), 4];
                var midPoint2 = [26.5 - (15 + this.x), -(20 - (15 + this.z)), 4]; //[x,-z,y]
                var speed = 8;
                break;
            case "2":
                var initialPoint = [11.5 - (15 + this.x), -(20 - (15 + this.z)), 0];
                var midPoint1 = [11.5 - (15 + this.x), -(20 - (15 + this.z)), 4];
                var midPoint2 = [13.5 - (15 + this.x), -(20 - (15 + this.z)), 4];
                var speed = 8;
                break;
            case "3":
                if (player != null) {
                    var speed = 8;
                    if (player == "1") {
                        var initialPoint = [28.5 - (15 + this.x), -(20 - (15 + this.z)), 0];
                        var midPoint1 = [28.5 - (15 + this.x), -(20 - (15 + this.z)), 4];
                        var midPoint2 = [26.5 - (15 + this.x), -(20 - (15 + this.z)), 4];
                    } else {
                        var initialPoint = [11.5 - (15 + this.x), -(20 - (15 + this.z)), 0];
                        var midPoint1 = [11.5 - (15 + this.x), -(20 - (15 + this.z)), 4];
                        var midPoint2 = [13.5 - (15 + this.x), -(20 - (15 + this.z)), 4];
                    }
                } else {
                    var initialPoint = [14 + initialX - (15 + this.x), -(14 + initialZ - (15 + this.z)), 0];
                    var midPoint1 = [14 + initialX - (15 + this.x), -(14 + initialZ - (15 + this.z)), 2];
                    var midPoint2 = [0, 0, 2];
                    var speed = 4;
                }
                break;
            default:
                break;
        }

        var finalPoint = [0, 0, 0];
        var controlPoints = [initialPoint, midPoint1, midPoint2, finalPoint];

        this.animation = new BezierAnimation("piece", speed, controlPoints);
        this.animationRef = new AnimationRef(this.animation);
        this.animationRef.enable = true;
    }
}
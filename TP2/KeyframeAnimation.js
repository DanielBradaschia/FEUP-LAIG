class KeyFrameAnimation extends Animation {
    constructor(scene, animation_id, instant, begin, translation, rotation, scale) {
        super(scene, animation_id, instant-begin);        
        this.instant = instant;
        this.transMat = translation;
        this.rotMat = rotation;
        this.scaleMat = scale;
    }
    display() {

    }

    update() {

    }
}
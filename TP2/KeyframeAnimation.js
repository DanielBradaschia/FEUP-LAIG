class KeyFrameAnimation extends Animation {
    constructor(scene, animation_id, instant, translation, rotation, scale) {
        this.scene = scene;
        this.id = animation_id;
        this.instant = instant;
        this.transMat = translation;
        this.rotMat = rotation;
        this.scaleMat = scale;
    }
}
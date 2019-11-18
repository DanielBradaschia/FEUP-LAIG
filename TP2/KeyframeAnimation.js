class KeyframeAnimation extends Animation {
    constructor(scene, animations) {
        super(scene);
        
        this.animations = animations;
        this.animMatrix;
    }

    calcAnimation() {
        var d_instant = 0;

        var d_scale = { x: 1, y: 1, z: 1 }
        var d_translate = { x: 0, y: 0, z: 0 }
        var d_rotate = { x: 0, y: 0, z: 0 }

        for (let i = 0; i < animations.length - 1; i++) {
            d_instant = this.animations[i + 1].instant - this.animations[i].instant;

            d_scale.x = ((this.animations[i + 1].scale[0] - this.animations[i].scale[0]) / d_instant) / 60;
            d_scale.y = ((this.animations[i + 1].scale[1] - this.animations[i].scale[1]) / d_instant) / 60;
            d_scale.z = ((this.animations[i + 1].scale[2] - this.animations[i].scale[2]) / d_instant) / 60;

            d_translate.x = ((this.animations[i + 1].translate[0] - this.animations[i].translate[0]) / d_instant) / 60;
            d_translate.y = ((this.animations[i + 1].translate[1] - this.animations[i].translate[1]) / d_instant) / 60;
            d_translate.z = ((this.animations[i + 1].translate[2] - this.animations[i].translate[2]) / d_instant) / 60;

            d_rotate.x = ((this.animations[i + 1].rotate[0] - this.animations[i].rotate[0]) / d_instant) / 60;
            d_rotate.y = ((this.animations[i + 1].rotate[1] - this.animations[i].rotate[1]) / d_instant) / 60;
            d_rotate.z = ((this.animations[i + 1].rotate[2] - this.animations[i].rotate[2]) / d_instant) / 60;
        }
    }

    update(t) { }

    apply() { }

}
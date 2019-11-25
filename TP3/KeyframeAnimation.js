class KeyframeAnimation extends Animation {
    constructor(scene, animations) {
        super(scene);

        this.animations = animations;
        this.animMatrix;

        this.transformations = [];
        this.translate = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.rotate = [0, 0, 0];
        this.calcAnimation();

    }

    calcAnimation() {
        this.transformations.push(null);


        for (let i = 0; i < this.animations.length - 1; i++) {

            var d_instant = 0;
            var d_scale = { x: 1, y: 1, z: 1 }
            var d_translate = { x: 0, y: 0, z: 0 }
            var d_rotate = { x: 0, y: 0, z: 0 }

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

            var anim = { d_instant: d_instant, d_scale: d_scale, d_translate: d_translate, d_rotate: d_rotate }

            this.transformations.push(anim);
        }
    }

    update(t) {        
        this.i = 0;
        
        for (; this.i < this.animations.length; this.i++) {
            
            if (t <= this.animations[this.i].instant) {
                console.log("Anim: " + this.i + "           " + t);
                this.translate[0] += this.transformations[this.i].d_translate['x'];
                this.translate[1] += this.transformations[this.i].d_translate['y'];
                this.translate[2] += this.transformations[this.i].d_translate['z'];

                this.scale[0] += this.transformations[this.i].d_scale['x'];
                this.scale[1] += this.transformations[this.i].d_scale['y'];
                this.scale[2] += this.transformations[this.i].d_scale['z'];

                this.rotate[0] += this.transformations[this.i].d_rotate['x'];
                this.rotate[1] += this.transformations[this.i].d_rotate['y'];
                this.rotate[2] += this.transformations[this.i].d_rotate['z'];

                break;
            }
        }
    }

    apply() {
        let anim = this.transformations[this.i];

        if (anim == undefined) return;
        this.scene.translate(this.translate[0], this.translate[1], this.translate[2]);
        this.scene.rotate(this.rotate[2], 0, 0, 1);
        this.scene.rotate(this.rotate[1], 0, 1, 0);
        this.scene.rotate(this.rotate[0], 1, 0, 0);
        this.scene.scale(this.scale[0], this.scale[1], this.scale[2]);
    }

}
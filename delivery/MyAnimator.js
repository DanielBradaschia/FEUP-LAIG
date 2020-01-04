/**
* MyAnimator
* @constructor
*/
class MyAnimator extends Animation {
    constructor(scene) {
        super(scene);
        this.animations = [];
        this.oldAnimations = [];
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    removeAnimation() {
        this.animations.pop();
    }

    update(t) {
        //console.log(t);
        for (let i = 0; i < this.animations.length; i++)
            this.animations[i].update(t);
    }

    clear() {
        this.animations = [];
    }

    setKeyframes() {

    }

    display() { }
}
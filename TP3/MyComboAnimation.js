/**
 * MyComboAnimation
 * @constructor
 */

function MyComboAnimation(id, animations) {
    MyAnimation.call();

    this.id = id;
    this.type = "combo";
    this.animations = animations;
}

MyComboAnimation.prototype = Object.create(MyAnimation.prototype);
MyComboAnimation.prototype.constructor = MyComboAnimation;

/*
* Faz uma animation ref para cada animação do vetor
*/
MyComboAnimation.prototype.getAnimationsRefs = function () {
    var animationRefs = [];

    for (let i = 0; i < this.animations.length; i++) {
        var newRefAnimation = new MyAnimationRef(this.animations[i]);
        animationRefs.push(newRefAnimation);
    }

    return animationRefs;
};
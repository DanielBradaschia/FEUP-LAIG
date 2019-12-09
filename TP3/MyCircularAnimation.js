/**
 * MyCircularAnimation
 * @constructor
 */

var DEGREE_TO_RAD = Math.PI / 180;

function MyCircularAnimation(id, speed, centerx, centery, centerz, radius, startang, rotang) {
    MyAnimation.call();

    this.id = id;
    this.type = "circular";
    this.speed = speed;
    this.centerx = centerx;
    this.centery = centery;
    this.centerz = centerz;
    this.radius = radius;

    this.startang = startang * DEGREE_TO_RAD;
    this.rotang = rotang * DEGREE_TO_RAD;

    if (this.rotang > 0) this.angularSpeed = speed / radius;
    else this.angularSpeed = -speed / radius;
}

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;


/*
 * fun��o que retorna a matriz do objeto, fundamental para a anima��o.
 */
MyCircularAnimation.prototype.getMatrix = function (time) {
    var currAng = this.startang + this.angularSpeed * time; //�ngulo a rodar

    var matrix = mat4.create();
    mat4.identity(matrix);

    mat4.translate(matrix, matrix, [this.centerx, this.centery, this.centerz]);
    mat4.rotate(matrix, matrix, currAng, [0, 1, 0]);
    mat4.translate(matrix, matrix, [this.radius, 0, 0]);

    if (this.rotang > 0) mat4.rotate(matrix, matrix, Math.PI, [0, 1, 0]); //se o �ngulo for maior do que 0, rodar 180� para rodar para z negativo

    return matrix;
};

/*
 * retorna o tempo total da anima��o.
 */
MyCircularAnimation.prototype.getDuration = function () {
    return Math.abs(this.rotang / this.angularSpeed);
};
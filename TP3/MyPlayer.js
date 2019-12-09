/**
* MyPlayer
* @constructor
*/
class MyPlayer extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id;
        this.setInfo();
        this.score = 0;

        this.minutes = "00";
        this.seconds = "00";
    }

    setInfo() {
        switch (this.id) {
            case 1:
                this.color = "red";
                this.position = vec3.fromValues(3, 15, 8);
                break;
            case 2:
                this.color = "blue";
                this.position = vec3.fromValues(3, 15, -2);
                break;
            default:
                break;
        }
    }

    addScore() {
        this.score++;
    }

    startCounter() {
        this.totalSeconds = 0;
        this.cicle = setInterval(
            function () {
                this.totalSeconds++;
                this.setTime();
            }.bind(this),
            1000
        );
    }

    startRevCounter() {
        this.totalSeconds = 11;
        this.cicle = setInterval(
            function () {
                this.totalSeconds--;
                this.setTime();
            }.bind(this),
            1000
        );
    }

    stopCounter() {
        clearInterval(this.cicle);
    }

    setTime() {
        this.minutes = this.convert(parseInt(this.totalSeconds / 60));
        this.seconds = this.convert(this.totalSeconds % 60);
    }

    convert(n) {
        var valString = n + "";
        if (valString.length < 2) return "0" + valString;
        else return valString;
    }

    clearTime() {
        this.minutes = "00";
        this.seconds = "00";
    }

}
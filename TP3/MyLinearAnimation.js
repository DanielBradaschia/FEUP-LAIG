/**
 * MyLinearAnimation
 * @constructor
 */

function MyLinearAnimation(id, speed, cpoints) {
    MyAnimation.call();

    this.id = id;
    this.type = "linear";
    this.speed = speed;
    this.cpoints = cpoints;
    this.distancePerVector = []; //cada index corresponde � dist�ncia de cada segmento de reta.
    this.timePerVector = []; //cada index corresponde ao tempo de cada segmento de reta.
    this.totalDistance = 0; //dist�ncia total da anima��o, ou seja, soma de todos os valores de distancePerVector.
    this.Index = 0; //corresponde ao segmento de reta que est� de momento a realizar.
    this.timeCounter; //contador de tempo dos segmentos de reta, de forma a poder comparar com o tempo recebido no sistema.

    this.updateVariables();
    this.updateAngle();

    //calcula a dist�ncia de cada segmento de reta e a dist�ncia total.
    for (var i = 0; i < this.cpoints.length - 1; i++) {
        var distance = Math.sqrt(Math.pow(this.cpoints[i + 1][0] - this.cpoints[i][0], 2) + Math.pow(this.cpoints[i + 1][1] - this.cpoints[i][1], 2) + Math.pow(this.cpoints[i + 1][2] - this.cpoints[i][2], 2));
        this.distancePerVector.push(distance);
        this.totalDistance += distance;
    }

    //calcula o tempo de cada segmento de reta.
    for (var i = 0; i < this.distancePerVector.length; i++) {
        this.timePerVector.push(this.distancePerVector[i] / this.speed);
    }

    this.updateVelocity();
}

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

/*
 * fun��o que retorna a matriz do objeto, fundamental para a anima��o.
 */
MyLinearAnimation.prototype.getMatrix = function (time) {

    var eachTime; //somat�rio do tempo percorrido pelos segmentos de reta anteriores, de forma a poder isolar cada segmento como um caso independente.
    var percentage; //percentagem de movimento.

    this.getTimeCounter(); //obtem o contador de tempo
    this.checkVectors(time); //verifica que segmento de reta deve analisar

    if (this.Index == 0)
        eachTime = 0;
    else
        eachTime = this.timeCounter - this.timePerVector[this.Index];

    percentage = time - eachTime;

    //calculo da quantidade de movimento
    var deltaX = percentage * this.vx;
    var deltaY = percentage * this.vy;
    var deltaZ = percentage * this.vz;

    var matrix = mat4.create();
    mat4.identity(matrix);

    mat4.translate(matrix, matrix, [deltaX, deltaY, deltaZ]);
    mat4.translate(matrix, matrix, [
        this.initialX,
        this.initialY,
        this.initialZ
    ]);
    mat4.rotate(matrix, matrix, Math.PI / 2 - this.angle, [0, 1, 0]);

    return matrix;
};

/*
 * fun��o que retorna o tempo total da anima��o.
 */
MyLinearAnimation.prototype.getDuration = function () {
    return this.totalDistance / this.speed;
};

/*
 * fun��o que atribui valores ao ponto inicial e final do segmento de reta que est� a tratar.
 */
MyLinearAnimation.prototype.updateVariables = function () {
    this.initialX = this.cpoints[this.Index][0];
    this.initialY = this.cpoints[this.Index][1];
    this.initialZ = this.cpoints[this.Index][2];
    this.finalX = this.cpoints[this.Index + 1][0];
    this.finalY = this.cpoints[this.Index + 1][1];
    this.finalZ = this.cpoints[this.Index + 1][2];
};

/*
 * fun��o que atualiza, ou extrai, o angulo com base no ponto inicial e final atual.
 */
MyLinearAnimation.prototype.updateAngle = function () {
    this.angle = Math.atan2(this.finalZ - this.initialZ, this.finalX - this.initialX);
};

/*
 * fun��o que atualiza, ou extrai, as 3 componentes da velocidade com base no ponto inicial e final atual, e a dist�ncia desse mesmo segmento de reta.
 */
MyLinearAnimation.prototype.updateVelocity = function () {
    for (var i = 0; i < this.distancePerVector.length; i++) {
        this.vx = this.speed * ((this.finalX - this.initialX) / Math.abs(this.distancePerVector[this.Index]));
        this.vy = this.speed * ((this.finalY - this.initialY) / Math.abs(this.distancePerVector[this.Index]));
        this.vz = this.speed * ((this.finalZ - this.initialZ) / Math.abs(this.distancePerVector[this.Index]));
    }
};

/*
 * fun��o que verifica se o objeto j� acabou de percorrer o segmento de reta atual, passando para o seguinte, caso exista, e atualiza todas as vari�veis.
 */
MyLinearAnimation.prototype.checkVectors = function (time) {
    if (time >= this.timeCounter && this.Index != this.timePerVector.length - 1) {
        this.Index++;
        this.updateVariables();
        this.updateAngle();
        this.updateVelocity();
        this.getTimeCounter();
    }
};

/*
 * fun��o que calcula o tempo total dos segmentos de reta j� percorridos, contanto com o atual.
 */
MyLinearAnimation.prototype.getTimeCounter = function () {
    this.timeCounter = 0;
    for (var i = 0; i <= this.Index; i++) {
        this.timeCounter += this.timePerVector[i];
    }
};


/*
 * func�o que limpa todas as vari�veis da anima��o, assim que esta acaba.
 */
MyLinearAnimation.prototype.reset = function () {
    this.Index = 0;
    this.timeCounter = 0;
    this.updateVariables();
    this.updateAngle();
    this.updateVelocity();
    this.getTimeCounter();
};
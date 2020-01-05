/**
* MyMove
* @constructor
*/
class MyMove extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board;
        this.piece;
        this.moveAnimation = new MyAnimator(scene);
        this.position1x1 = [-0.65 + 0.2487505, 0.10101, 0.62 - 0.2487505]; //[x, y, z] coordinates of 1x1 tile
    }

    getPiece(){//(argumento: player)?
        //devolve posição inicial da peça de cada jogador?? 
    }

    set(){}

    unset(){}

    movePiece(){
        //TODO
        //criar tres pontos: 1 acima da posição de origem da peça [x, 0.010101 + 3, z]
        //outro no centro do tabuleiro com y igual ao ponto anterior, 
        //final corresspondente À posição fianal [x * colluna, y, z + linha]
        //fazer push em keyframes e fica criada a animação. 
    }

    display(){} //necessároio criar uma variável para saber se a animação ainda não acabou e de seguida passar a vez ao próximo jogador



}
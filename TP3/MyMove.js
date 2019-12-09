/**
* MyMove
* @constructor
*/
class MyMove extends CGFobject {
    constructor(type, newCell, cell, state, player) {
        this.type = type;
        this.cell = cell;
        this.newCell = newCell;
        this.state = state;
        this.player = player;
    }
}
/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        let folder = this.gui.addFolder('Scene');

        //Dropbox
        folder.add(this.scene, 'selectedCamera', this.scene.view).name('Select View');
        folder.add(this.scene, 'currGraph', this.scene.ambient).name('Select Ambient');

        let f0 = folder.addFolder('Lights');
        //Checkbox
        f0.add(this.scene, 'light1').name('light 1');
        f0.add(this.scene, 'light2').name('light 2');
        f0.add(this.scene, 'spotRed').name('Spot Red');
        f0.add(this.scene, 'spotGreen').name('Spot Green');
        f0.add(this.scene, 'spotBlue').name('Spot Blue');

        this.gui.add(this.scene, 'startGame').name('Play Game!');

        this.gui.add(this.scene, 'undo').name('Undo!');

        this.gui.add(this.scene, 'clear').name('Quit Game/Clear Board!');

        this.gui.add(this.scene, 'video').name('Play Video!');

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    }

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    }

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
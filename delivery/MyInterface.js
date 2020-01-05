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

        let folder = this.gui.addFolder('Controls');

        //Dropbox
        folder.add(this.scene, 'selectedCamera', this.scene.view).name('Change Angle');
        folder.add(this.scene, 'currGraph', this.scene.ambient).name('Change Scene');

        let f0 = folder.addFolder('Lights');
        //Checkbox
        f0.add(this.scene, 'light1').name('light 1');
        f0.add(this.scene, 'light2').name('light 2');
        f0.add(this.scene, 'spotRed').name('Red');
        f0.add(this.scene, 'spotGreen').name('Green');
        f0.add(this.scene, 'spotBlue').name('Blue');

        this.gui.add(this.scene, 'startGame').name('Play Xero-G!');

        this.gui.add(this.scene, 'undo').name('Undo!');

        this.gui.add(this.scene, 'clear').name('Quit!');

        this.gui.add(this.scene, 'video').name('Movie!');

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
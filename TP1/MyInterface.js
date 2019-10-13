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
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    processKeyboard(event){
        //CGFinterface.prototype.processKeyboard.call(this,event);

        if(this.gui.isKeyPressed("KeyM"))
        {
            console.log("entrei");
            this.scene.changeMaterial();
        }

    }
    //Create lights
    addLights(lights){
        var lightsGroup = this.gui.addFolder("Lights");
        lightsGroup.open();

        for(let i in lights)
        {
            if(lights.hasOwnProperty(i))
            {
                this.scene.lightGroup[i] = lights[i].enabled;
                lightsGroup.add(this.scene.lightGroup, i);
            }
        }
    }
}
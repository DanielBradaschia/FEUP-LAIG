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
        this.processKeyboard(event);
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

        if(event.code == "KeyM")
        {
            this.scene.changeMaterial();
        }
        else if (event.code == "KeyC") 
        {
            this.scene.changeView();
        }
    }
    //Create lights
    addLights(lights, numLights){
        var lightsGroup = this.gui.addFolder("Lights");
        lightsGroup.open();

        var j = 0;

        for(let i in lights)
        {
            if(j >= numLights)
                break;
            if(lights.hasOwnProperty(i))
            {
                this.scene.lightGroup[i] = lights[i].enabled;
                lightsGroup.add(this.scene.lightGroup, i);
            }
            j++;
        }
    }

    addViewsGroup(views) {

        var group = this.gui.addFolder("Views");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in views) {
            if (views.hasOwnProperty(key)) {
                this.scene.graph.viewsId[key] = views[key].enabled;

            }
        }
    }

}
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

        this.gui.add(this.scene, 'displayAxis').name("Display axis");
        this.model = {};
        // add a group of controls (and open/expand by defult)
        this.scenes = this.gui.addFolder("Scenes");
        this.scenes.open();
        this.gui.scene = 'Scene_1';


        this.gui.sceneList = this.scenes.add(this.gui, 'scene', ['Scene_1', 'Scene_2']);

        this.gui.sceneList.onFinishChange(function () {
            this.removeFolder("Lights", this.gui);
            this.removeFolder("Players Turn", this.gui);
            this.scene.changeGraph(this.gui.scene + '.xml');
        }.bind(this))

        this.initKeys();

        return true;
    }

    removeFolder(name, parent) {
        if (!parent)
            parent = this.gui;
        var folder = parent.__folders[name];


        if (!folder) {
            return;
        }

        folder.close();

        parent.__ul.removeChild(folder.domElement.parentNode);
        delete parent.__folders[name];

        parent.onResize();
    };


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

    addViewsGroup() {
        const cameras = this.scene.graph.viewMap;

        const cameraDropdownModel = [
            ...cameras.keys()
        ];

        this.model.cameraIndex = this.scene.graph.defaultViewId;

        this.gui.add(this.model, "cameraIndex", cameraDropdownModel)
            .name("Current camera")
            .onChange(val => this.scene.setCurrentCamera(val));
    }


}
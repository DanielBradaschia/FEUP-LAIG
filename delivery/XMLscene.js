var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface, numGraphs) {
        super();

        this.interface = myinterface;
        this.graphs = [];
        this.numGraphs = numGraphs;
        this.graphsLoaded = 0;
        this.currGraph = 0;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(20);

        this.counterM = 0;
        this.counterV = 0;

        this.graphs = []; 
        this.graphsLoaded = 0;
        this.currGraph = 0;

        this.light1 = true;
        this.light2 = true;
        this.spotRed = false;
        this.spotGreen = false;
        this.spotBlue = false;

        this.selectedCamera = 0;
        this.defaultCamera = 0;
        this.view = { 'Front': 0, 'Left': 1, 'Right': 2, 'Back': 3 };
        this.viewAngle = 0;

        this.ambient = { 'Scene_1': 0, 'Scene_2': 1 };

        this.setPickEnabled(true);

        this.XeroG = new MyXeroG(this);

        this.playGame = false;
        this.timeInit;
        this.timeEnd;

        this.undo = function () {
            this.XeroG.undoMove();
        }

        this.startGame = function () {
            alert("Xero-G started!");
            this.playGame = true;
            this.timeInit = performance.now();
            this.XeroG.clearGame();
        }

        this.clear = function () {
            this.playGame = false;
            this.XeroG.clearGame();
            alert("Game Over!");
            this.timeEnd = performance.now();
            console.log("Game Time: " + (this.timeEnd - this.timeInit) / 1000);
        }

        this.video = function () {
            if(this.XeroG.videoRunning == false) {
                this.XeroG.playVideo();
            }
        }
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {

        var defaultCamera = this.graphs[this.currGraph].cameraz[0]; // Gets ID of default view

        var cam = this.graphs[this.currGraph].cameraz[defaultCamera]; // Gets default view from array of views
        this.camera = cam; // Sets default view

        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        this.lights = [];

        // Reads the lights from the scene graph.

        for (var key in this.graphs[this.currGraph].lightz) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graphs[this.currGraph].lightz.hasOwnProperty(key)) {
                this.lights[i] = new CGFlight(this, i);
                var light = this.graphs[this.currGraph].lightz[key];

                // Sets position
                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);

                // Sets ilumination values
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);


                // Sets attenuation values
                this.lights[i].setConstantAttenuation(light[6]);
                this.lights[i].setLinearAttenuation(light[7]);
                this.lights[i].setQuadraticAttenuation(light[8]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[9]);
                    this.lights[i].setSpotExponent(light[10]);
                    this.lights[i].setSpotDirection(light[11][0], light[11][1], light[11][2]);
                }

                this.lights[i].setVisible(false);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();
                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    addGraph(graph) {
        this.graphs.push(graph);
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graphs[this.currGraph].referenceLength);

        this.gl.clearColor(this.graphs[this.currGraph].background[0], this.graphs[this.currGraph].background[1], this.graphs[this.currGraph].background[2], this.graphs[this.currGraph].background[3]);

        this.setGlobalAmbientLight(this.graphs[this.currGraph].ambient[0], this.graphs[this.currGraph].ambient[1], this.graphs[this.currGraph].ambient[2], this.graphs[this.currGraph].ambient[3]);

        this.initLights();

        this.sceneInited = true;

        this.initCameras();
    }

    checkKeys(t) {
        var text = "Keys pressed: ";
        var keysPressed = false;
        // Check for key codes e.g. in ​ https://keycode.info/
        if (this.gui.isKeyPressed("KeyM")) {
            this.counterM++;
            text += " M ";
            keysPressed = true;
        }
        if (this.gui.isKeyPressed("KeyV")) {
            this.counterV++;
            text += " V ";
            keysPressed = true;
        }
        if (keysPressed) console.log(text);
    }

    update(t) {
        //time management
        this.lastTime = this.lastTime || 0.0;
        this.deltaTime = t - this.lastTime || 0.0;
        this.deltaTime = this.deltaTime / 1000; //"deltaTime" is now in seconds
        this.currentTime = (this.currentTime + this.deltaTime) || 0.0; //"currentTime" keeps track of time in seconds


        this.ani = this.graph.animations;
        for (var key in this.ani) {

            this.ani[key].update(this.deltaTime);
        }

        this.XeroG.update(this.deltaTime);
        this.lastTime = t;

    }


    updateCamera(i) {
        var cam = this.graphs[this.currGraph].cameraz[this.graphs[this.currGraph].viewIds[i]];
        switch (this.XeroG.turn) {
            case 0:
                if (this.viewAngle > 0 && this.XeroG.pause) {
                    this.camera.orbit((0, 0, 1), 5 * DEGREE_TO_RAD);
                    this.viewAngle -= 5;
                }
                else this.XeroG.pause = true;
                break;
            case 1:
                if (this.viewAngle < 180 && this.XeroG.pause) {
                    this.camera.orbit((0, 0, 1), -5 * DEGREE_TO_RAD);
                    this.viewAngle += 5;
                }
                else this.XeroG.pause = true;
                break;
        }

        this.camera = cam;
    }



    display() {
        this.clearPickRegistration();

        if (this.playGame == true) {
            this.XeroG.logPicking();
            this.XeroG.gameRunning = true;
        }

        if (this.sceneInited) {

            // ---- BEGIN Background, camera and axis setup

            // Clear image and depth buffer everytime we update the scene
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            // Initialize Model-View matrix as identity (no transformation
            this.updateProjectionMatrix();
            this.loadIdentity();
            // Apply transformations corresponding to the camera position relative to the origin
            this.applyViewMatrix();

            this.pushMatrix();
            //this.axis.display();


            //Updates View
            this.updateCamera(this.selectedCamera);

            // Turn On/Off Light 1
            if (this.light1)
                this.lights[0].enable();
            else
                this.lights[0].disable();

            // Turn On/Off Light 2
            if (this.light2)
                this.lights[1].enable();
            else
                this.lights[1].disable();

            // Turn On/Off Red Spotlight
            if (this.spotRed)
                this.lights[2].enable();
            else
                this.lights[2].disable();

            // Turn On/Off Green Spotlight
            if (this.spotGreen)
                this.lights[3].enable();
            else
                this.lights[3].disable();

            // Turn On/Off Blue Spotlight
            if (this.spotBlue)
                this.lights[4].enable();
            else
                this.lights[4].disable();


            // Update all lights
            for (var i = 0; i < this.lights.length; i++) {
                this.lights[i].update();
            }


            // Displays the scene (MySceneGraph function).
            this.graphs[this.currGraph].displayScene();

            this.pushMatrix();
            this.translate(3, 3.2, 2);
            this.XeroG.display();
            this.popMatrix();

            this.popMatrix();
            // ---- END Background, camera and axis setup
        }
    }

}




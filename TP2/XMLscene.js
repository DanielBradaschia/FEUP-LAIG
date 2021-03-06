var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightGroup = {};
        this.changeViews = 0;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        var date = new Date();

        this.initTime = date.getTime();

        this.axis = new CGFaxis(this);
        this.texture_rtt = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.security = new MySecurityCamera(this);
        this.displayAxis = true;
        this.setUpdatePeriod(16.67);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.security_camera = this.security;
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
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
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        
        this.camera = this.graph.cameras[this.graph.currView];
        this.interface.setActiveCamera(this.camera);

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.interface.addLights(this.lights, this.graph.numLights);
        this.interface.addViewsGroup(this.graph.viewsId);

        this.sceneInited = true;
    }


    setCurrentCamera(camera_id) {
        const selected_camera = this.graph.viewMap.get(camera_id);
        //console.log(selected_camera);

        if (!selected_camera) {
            console.warn(`Camera with id '${camera_id}' was not found, falling back to default camera`);
        }

        for (let i = 0; i < this.graph.cameras.length; i++)
            if (this.graph.cameras[i] == selected_camera)
                this.camera = this.graph.cameras[i];

                
        this.interface.setActiveCamera(this.camera);
    }
    /**
     * Change Views in the scene.
     */
    changeView() {
        if (this.graph.currView < this.graph.cameras.length - 1) {
            this.graph.currView++;
        }
        else {
            this.graph.currView = 0;
        }

        this.camera = this.graph.cameras[this.graph.currView];
        this.interface.setActiveCamera(this.camera);
    }
    
    /**
     * Change Material in the scene.
     */
    changeMaterial(){
        if (this.graph.currMat < this.graph.currMatId.length-1) {
            this.graph.currMat++;
        }
        else
        this.graph.currMat = 0;
    };

    /**
     * Renders the scene.
     */
    render() {
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
        if (this.displayAxis)
            this.axis.display();
        let i = 0;
        for (var j in this.lightGroup)
        {
            if(this.lightGroup.hasOwnProperty(j))
            {
                if(this.lightGroup[j])
                {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else
                {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }
        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
    
    renderSecurity(){
        this.texture_rtt.attachToFrameBuffer();
        this.render();
        this.texture_rtt.detachFromFrameBuffer();
    }
    
    display() {
        this.renderSecurity();
        this.render();
        this.gl.disable(this.gl.DEPTH_TEST);
        this.security.display();
        this.gl.enable(this.gl.DEPTH_TEST);
    }
    update(t) {
        var elapsedTime = (t - this.initTime) / 1000;

        for (const key in this.graph.nodes) {
            if (this.graph.nodes[key].animations != null)
                this.graph.nodes[key].animations.update(elapsedTime);
        }
    }

}
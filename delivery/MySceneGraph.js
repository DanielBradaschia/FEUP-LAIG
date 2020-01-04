var DEGREE_TO_RAD = Math.PI / 180;
var EXTENSIONS_LIST = ['jpg', 'png'];
var ERROR_PARSING = -1;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        this.transformations = {};
        this.primitives = {};
        this.materials = {};
        this.textures = {};
        this.animations = {};
        this.isBind = false; //information about any texture is bind 
        this.textureBinded;

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        this.scene.graphsLoaded++,
        this.scene.addGraph(this);

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        if(this.scene.graphsLoaded == this.scene.numGraphs){
            this.scene.onGraphLoaded();
        }        
        
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == ERROR_PARSING)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == ERROR_PARSING)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == ERROR_PARSING)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == ERROR_PARSING)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == ERROR_PARSING)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == ERROR_PARSING)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == ERROR_PARSING)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == ERROR_PARSING)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == ERROR_PARSING)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == ERROR_PARSING)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        //this.onXMLMinorError("To do: Parse views and create cameras.");

        var children = viewsNode.children;

        this.cameraz = [];
        var grandChildren = [];

        var defaultView = this.reader.getString(viewsNode, 'default');
        this.cameraz.push(defaultView);

        this.viewIds = [];


        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var viewId = this.reader.getString(children[i], 'id');

            if (viewId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.cameraz[viewId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + viewId + ")";

            this.viewIds.push(viewId);

            var cam;

            // Checks if view is perspective
            if (children[i].nodeName == "perspective") {

                var near = this.reader.getFloat(children[i], 'near');
                var far = this.reader.getFloat(children[i], 'far');
                var angle = this.reader.getFloat(children[i], 'angle');

                var angleRad = angle * DEGREE_TO_RAD;

                grandChildren = children[i].children;

                // Checks position
                if (grandChildren[0].nodeName != "from")
                    this.onXMLMinorError("unknown tag <" + grandChildren[0].nodeName + ">");

                var fromX = this.reader.getFloat(grandChildren[0], 'x');
                var fromY = this.reader.getFloat(grandChildren[0], 'y');
                var fromZ = this.reader.getFloat(grandChildren[0], 'z');

                // Checks target
                if (grandChildren[1].nodeName != "to")
                    this.onXMLMinorError("unknown tag <" + grandChildren[1].nodeName + ">");

                var toX = this.reader.getFloat(grandChildren[1], 'x');
                var toY = this.reader.getFloat(grandChildren[1], 'y');
                var toZ = this.reader.getFloat(grandChildren[1], 'z');

                cam = new CGFcamera(angleRad, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ)); // Creates camera
            }

            // Checks if view is ortho
            if (children[i].nodeName == "ortho") {
                var near = this.reader.getFloat(children[i], 'near');
                var far = this.reader.getFloat(children[i], 'far');
                var left = this.reader.getFloat(children[i], 'left');
                var right = this.reader.getFloat(children[i], 'right');
                var top = this.reader.getFloat(children[i], 'top');
                var bottom = this.reader.getFloat(children[i], 'bottom');

                grandChildren = children[i].children;

                // Checks position
                if (grandChildren[0].nodeName != "from")
                    this.onXMLMinorError("unknown tag <" + grandChildren[0].nodeName + ">");

                var fromX = this.reader.getFloat(grandChildren[0], 'x');
                var fromY = this.reader.getFloat(grandChildren[0], 'y');
                var fromZ = this.reader.getFloat(grandChildren[0], 'z');

                // Checks target
                if (grandChildren[1].nodeName != "to")
                    this.onXMLMinorError("unknown tag <" + grandChildren[1].nodeName + ">");

                var toX = this.reader.getFloat(grandChildren[1], 'x');
                var toY = this.reader.getFloat(grandChildren[1], 'y');
                var toZ = this.reader.getFloat(grandChildren[1], 'z');

                if (grandChildren[2].nodeName != "up")
                    this.onXMLMinorError("unknown tag <" + grandChildren[2].nodeName + ">");

                var upX = this.reader.getFloat(grandChildren[2], 'x');
                var upY = this.reader.getFloat(grandChildren[2], 'y');
                var upZ = this.reader.getFloat(grandChildren[2], 'z');

                cam = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ), vec3.fromValues(upX, upY, upZ)); // Creates camera
            }
            this.cameraz[viewId] = cam;

        }
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        if (children.length > 8)
            return this.onXMLError("Only 8 ligths allowed by WebGL");

        this.lightz = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lightz[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the attenuation values
            var constant, linear, quadratic;

            for (var j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName == "attenuation") {
                    constant = this.reader.getFloat(grandChildren[j], 'constant');
                    linear = this.reader.getFloat(grandChildren[j], 'linear');
                    quadratic = this.reader.getFloat(grandChildren[j], 'quadratic');
                }
            }

            global.push(...[constant, linear, quadratic]);

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight]);
            }

            this.lightz[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL

        var currentTexture = texturesNode.children;
        var singleTextureDefined = false;

        for (var i = 0; i < currentTexture.length; i++) {

            if (currentTexture[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + currentTexture[i].nodeName + ">");
                continue;
            }

            var textureID = this.reader.getString(currentTexture[i], 'id');
            //    var length_s = this.reader.getString(currentTexture[i], 'length_s');
            //    var length_t = this.reader.getString(currentTexture[i], 'length_t');

            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each primitive (conflict: ID = " + textureID + ")";

            var filePath = null;
            var filePath = this.reader.getString(currentTexture[i], 'file');
            if (filePath == null) {
                this.onXMLError("Texture must have an image file associated");
                return ERROR_PARSING;
            }
            else {
                if (!this.isValidFileType(filePath)) this.onXMLError("Texture file type invalid");
            }


            //   var length_s = this.reader.getFloat(currentTexture[i], 'length_s');
            //   var length_t = this.reader.getFloat(currentTexture[i], 'length_t');
            var coords = [];
            //   coords = [length_s, length_t];

            var newTexture = new CGFtexture(this.scene, "/" + filePath);
            //    if(length_s == null || length_t == null){
            this.textures[textureID] = [newTexture];
            singleTextureDefined = true;
            //   }
            //    else this.textures[textureID] = [newTexture, coords];
        }

        if (!singleTextureDefined) {
            this.onXMLError("there must be at least one texture block");
        }

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            nodeNames.length = 0; //cleaning variable from previous cyles

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            // Get Shininess
            //TODO - get shininess error  handling
            var shininness = this.reader.getFloat(children[i], 'shininess');

            //Getting the names of the material specs
            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //getting the values of the material specs
            var emission = [];
            var ambient = [];
            var diffuse = [];
            var specular = [];
            var a, r, g, b;

            //within each material parse trough its values
            //TODO - usar funcao parsecolor() para aceder aos valores de cada material
            for (var k = 0; k < nodeNames.length; k++) {
                switch (nodeNames[k]) {
                    case 'emission':
                        r = this.reader.getFloat(grandChildren[k], 'r');
                        g = this.reader.getFloat(grandChildren[k], 'g');
                        b = this.reader.getFloat(grandChildren[k], 'b');
                        a = this.reader.getFloat(grandChildren[k], 'a');

                        if (!(r >= 0.0 && r <= 1.0) || !(g >= 0.0 && g <= 1.0) || !(b >= 0.0 && b <= 1.0) || !(a >= 0.0 && a <= 1.0)) {
                            this.onXMLMinorError("Wrong values in <emission>");
                            continue;
                        }

                        emission.push(r);
                        emission.push(g);
                        emission.push(b);
                        emission.push(a);
                        break;
                    case 'ambient':
                        r = this.reader.getFloat(grandChildren[k], 'r');
                        g = this.reader.getFloat(grandChildren[k], 'g');
                        b = this.reader.getFloat(grandChildren[k], 'b');
                        a = this.reader.getFloat(grandChildren[k], 'a');

                        if (!(r >= 0.0 && r <= 1.0) || !(g >= 0.0 && g <= 1.0) || !(b >= 0.0 && b <= 1.0) || !(a >= 0.0 && a <= 1.0)) {
                            this.onXMLMinorError("Wrong values in <ambient>");
                            continue;
                        }

                        ambient.push(r);
                        ambient.push(g);
                        ambient.push(b);
                        ambient.push(a);
                        break;
                    case 'diffuse':
                        r = this.reader.getFloat(grandChildren[k], 'r');
                        g = this.reader.getFloat(grandChildren[k], 'g');
                        b = this.reader.getFloat(grandChildren[k], 'b');
                        a = this.reader.getFloat(grandChildren[k], 'a');

                        if (!(r >= 0.0 && r <= 1.0) || !(g >= 0.0 && g <= 1.0) || !(b >= 0.0 && b <= 1.0) || !(a >= 0.0 && a <= 1.0)) {
                            this.onXMLMinorError("Wrong values in <diffuse>");
                            continue;
                        }

                        diffuse.push(r);
                        diffuse.push(g);
                        diffuse.push(b);
                        diffuse.push(a);
                        break;
                    case 'specular':
                        r = this.reader.getFloat(grandChildren[k], 'r');
                        g = this.reader.getFloat(grandChildren[k], 'g');
                        b = this.reader.getFloat(grandChildren[k], 'b');
                        a = this.reader.getFloat(grandChildren[k], 'a');

                        if (!(r >= 0.0 && r <= 1.0) || !(g >= 0.0 && g <= 1.0) || !(b >= 0.0 && b <= 1.0) || !(a >= 0.0 && a <= 1.0)) {
                            this.onXMLMinorError("Wrong values in <specular>");
                            continue;
                        }

                        specular.push(r);
                        specular.push(g);
                        specular.push(b);
                        specular.push(a);
                        break;

                }
            }
            //creating new material and adding it to the materials list
            var newMaterial = new CGFappearance(this.scene);
            newMaterial.setShininess(shininness);
            newMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            newMaterial.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            newMaterial.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            newMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);
            this.materials[materialID] = newMaterial;


        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();
            var angle = 0;

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID ", transformationID);
                        if (!Array.isArray(coordinates)) return coordinates;
                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        //getting the angle and the axis values and apliyng the appropiate transformation 
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        var vetor = [];
                        if (axis == 'x') vetor = [1, 0, 0];
                        else if (axis == 'y') vetor = [0, 1, 0];
                        else vetor = [0, 0, 1];

                        var angle = this.reader.getString(grandChildren[j], 'angle');
                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, DEGREE_TO_RAD * angle, vetor);
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }


    /**
    * Parses the <animations> block.
    * @param {animations block element} animationsNode
    */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;
        var keyFrames;

        //Any number of animations
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLError("unknown tag <" + children[i].nodeName + ">");
            }

            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null) return "no ID defined for animation";
            if (this.animations[animationID] != null)
                return ("ID must be unique for each animation");

            this.animations[animationID] = new KeyFrameAnimation(this.scene);

            keyFrames = children[i].children;

            //any number of keyframes
            for (var j = 0; j < keyFrames.length; j++) {

                var AniFrame = [];

                var instant = this.reader.getFloat(keyFrames[j], 'instant');
                AniFrame.push(instant);

                var keyTransformations = keyFrames[j].children;

                var trans = [];
                trans.push(this.reader.getFloat(keyTransformations[0], 'x'));
                trans.push(this.reader.getFloat(keyTransformations[0], 'y'));
                trans.push(this.reader.getFloat(keyTransformations[0], 'z'));
                AniFrame.push(trans);

                var rot = [];
                rot.push(this.reader.getFloat(keyTransformations[1], 'angle_x'));
                rot.push(this.reader.getFloat(keyTransformations[1], 'angle_y'));
                rot.push(this.reader.getFloat(keyTransformations[1], 'angle_z'));
                AniFrame.push(rot);

                var scale = [];
                scale.push(this.reader.getFloat(keyTransformations[2], 'x'));
                scale.push(this.reader.getFloat(keyTransformations[2], 'y'));
                scale.push(this.reader.getFloat(keyTransformations[2], 'z'));
                AniFrame.push(scale);

                this.animations[animationID].keyFrames.push(AniFrame);

            }

        }
        this.log("Parsed animations");
    }


    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'plane' &&
                    grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'cylinder2' && grandChildren[0].nodeName != 'cylinderbase' &&
                    grandChildren[0].nodeName != 'gamepiece')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, cylinder base or plane)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }

            if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var triang = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);

                this.primitives[primitiveId] = triang;
            }

            if (primitiveType == 'cylinder') {
                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylin = new MyCylinder(this.scene, slices, stacks, height, top, base);

                this.primitives[primitiveId] = cylin;
            }
            if (primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }
            if (primitiveType == 'torus') {
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner radius of the primitive with ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer radius of the primitive with ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive with ID = " + primitiveId;

                var torus = new MyTorus(this.scene, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }

            if (primitiveType == 'plane') {
                // npartsU
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive with ID = " + primitiveId;
                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive with ID = " + primitiveId;

                var plane = new MyPlane(this.scene, npartsU, npartsV);

                this.primitives[primitiveId] = plane;
            }

            if (primitiveType == 'patch') {
                // npointsU
                var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
                if (!(npointsU != null && !isNaN(npointsU)))
                    return "unable to parse npointsU of the primitive with ID = " + primitiveId;
                // npointsV
                var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
                if (!(npointsV != null && !isNaN(npointsV)))
                    return "unable to parse npointsV of the primitive with ID = " + primitiveId;

                // npartsU
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive with ID = " + primitiveId;
                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive with ID = " + primitiveId;

                let controlPoints = [];
                let cp = grandChildren[0].children;

                for (let j = 0; j < cp.length; j++) {
                    let controlpoint = [];
                    // xx
                    var xx = this.reader.getFloat(cp[j], 'xx');
                    if (!(xx != null && !isNaN(xx)))
                        return "unable to parse xx of the primitive with ID = " + primitiveId;

                    // yy
                    var yy = this.reader.getFloat(cp[j], 'yy');
                    if (!(yy != null && !isNaN(yy)))
                        return "unable to parse yy of the primitive with ID = " + primitiveId;

                    // zz
                    var zz = this.reader.getFloat(cp[j], 'zz');
                    if (!(zz != null && !isNaN(zz)))
                        return "unable to parse zz of the primitive with ID = " + primitiveId;

                    controlpoint.push(xx);
                    controlpoint.push(yy);
                    controlpoint.push(zz);

                    controlPoints.push(controlpoint);
                }
                var patch = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);

                this.primitives[primitiveId] = patch;
            }

            if (primitiveType == 'cylinder2') {
                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
					return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

               var cylin = new MyCylinder2(this.scene, slices, stacks, height, top, base);

                this.primitives[primitiveId] = cylin;
            }

            if (primitiveType == 'cylinderbase') {
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                var cylinbase = new MyCylinderBase(this.scene, slices, radius);

                this.primitives[primitiveId] = cylinbase;
            }

            if (primitiveType == 'gamepiece') {

                var gamepiece = new MyOctoPiece(this.scene);

                this.primitives[primitiveId] = gamepiece;
            }

        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            //creates a node in the graph
            this.nodes[componentID] = new GraphNode(this, componentID);

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            //get the elements of the current component
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // T2
            var animationIndex = nodeNames.indexOf("animationref");

            // Transformations
            var compTransformations = grandChildren[transformationIndex].children;
            for (var j = 0; j < compTransformations.length; j++) {
                var values = [];
                switch (compTransformations[j].nodeName) {
                    case "translate":
                        values = this.parseCoordinates3D(compTransformations[j], "Unable to read coordinates for translaction transformation");
                        mat4.translate(this.nodes[componentID].transformMatrix, this.nodes[componentID].transformMatrix, values)
                        break;
                    case "scale":
                        values = this.parseCoordinates3D(compTransformations[j], "Unable to read coordinates for scale transformation");
                        mat4.scale(this.nodes[componentID].transformMatrix, this.nodes[componentID].transformMatrix, values);
                        break;
                    case "rotate":
                        var angle = this.reader.getFloat(compTransformations[j], 'angle');
                        var axis = this.reader.getString(compTransformations[j], 'axis');
                        if (axis == 'x') values = [1, 0, 0];
                        else if (axis == 'y') values = [0, 1, 0];
                        else values = [0, 0, 1];
                        mat4.rotate(this.nodes[componentID].transformMatrix, this.nodes[componentID].transformMatrix, DEGREE_TO_RAD * angle, values);
                        break;

                }


                /* Animations - T2 */
                if (animationIndex != -1) {
                    var animationId = this.reader.getString(grandChildren[animationIndex], 'id');
                    this.nodes[componentID].animationID.push(animationId);
                }

            }

            // Materials
            var compMaterials = grandChildren[materialsIndex].children;
            var materialsIDList = [];
            for (var k = 0; k < compMaterials.length; k++) {
                materialsIDList.push(this.reader.getString(compMaterials[k], 'id'));
            }
            this.nodes[componentID].materials = materialsIDList;

            // Texture
            var textureId = this.reader.getString(grandChildren[textureIndex], 'id');
            if (textureId != "inherit" && textureId != "none") {
                var length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                var length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
            }
            else {
                length_s = 1;
                length_t = 1;
            }
            this.nodes[componentID].textureID.push(textureId);
            this.nodes[componentID].textureID.push(length_s);
            this.nodes[componentID].textureID.push(length_t);

            // Children
            var compCildren = grandChildren[childrenIndex].children;
            for (var k = 0; k < compCildren.length; k++) {
                var childrenID = this.reader.getString(compCildren[k], 'id');
                this.nodes[componentID].addChild(childrenID);
            }
        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Function to ensure only permited file types are loaded
     */
    isValidFileType(filename) {
        return EXTENSIONS_LIST.indexOf(filename.split('.').pop()) > -1;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        //Another function need to be called in order to display graph recursively

        this.displayRecursive(this.idRoot, this.nodes[this.idRoot].materials, this.nodes[this.idRoot].textureID);

    }

    displayRecursive(idNode, MaterialsFather, idTextureFather) {

        var currentNode = this.nodes[idNode];

        var descendants = currentNode.children;

        var compMaterials = MaterialsFather;
        var IDTexture = [];
        IDTexture = idTextureFather;


        //check texture heritage 
        if (currentNode.textureID[0] != "inherit") {
            IDTexture = currentNode.textureID;
        }
        else {
            IDTexture = idTextureFather;
        }


        //check material heritage
        if (currentNode.materials[0] != "inherit") {
            compMaterials = currentNode.materials;
        }
        else compMaterials = MaterialsFather;

        var nodeAnimation = this.animations[currentNode.animationID[0]];
        //Multiplying the node's transformations matrix to the scene one 
        this.scene.multMatrix(currentNode.transformMatrix);
        if (nodeAnimation != undefined) {
            nodeAnimation.apply();
        }

        var currentTexture = [];
        currentTexture = this.textures[IDTexture[0]];
        var coords = [];
        coords.push(IDTexture[1]);
        coords.push(IDTexture[2]);

        //select material with M key
        var currentMaterial = this.materials[compMaterials[(this.scene.counterM % compMaterials.length)]];


        //Visit the node desendants, in case of primitive, display them, in case of intermediate nodes call descendants recursively
        for (var i = 0; i < descendants.length; i++) {
            var descendantID = descendants[i];
            if (this.primitives[descendantID] != null) {
                if ((coords[0] != null && coords[1] != null) &&
                    (descendantID == 'Rectangle' || descendantID == 'Triangle')) {
                    this.primitives[descendantID].updateTexCoords(coords);
                }
                currentMaterial.apply();

                //if texture id is "none" unbinds texture, if not binds, unless it's "inherit" and inherits from "none" id texture
                if (IDTexture[0] == 'none' && this.isBind == true) {
                    this.textureBinded.unbind();
                    this.isBind = false;
                }
                else {
                    if (IDTexture[0] != 'inherit' && IDTexture[0] != 'none') {
                        currentTexture[0].bind();
                        this.textureBinded = currentTexture[0];
                        this.isBind = true;
                    }
                }

                this.scene.pushMatrix();
                this.primitives[descendants[i]].display(); //desenha a primitiva
                this.scene.popMatrix();
            }

            else {
                this.scene.pushMatrix();
                this.displayRecursive(descendants[i], compMaterials, IDTexture);
                this.scene.popMatrix();
            }
        }
    }
}
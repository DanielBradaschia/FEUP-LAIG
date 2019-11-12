var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATION_INDEX = 7;
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
        this.viewsId = [];
        this.currView = 0;

        this.idRoot = null;                    // The id of the root element.


        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.currMatId = [];
        this.currMat = 0;
        // File reading 
        this.reader = new CGFXMLreader();

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

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
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
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1) {
            return "tag <animations> missing";
        }
        else {
            if (index != ANIMATION_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
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

        //var defaultCamera = this.reader.getString(viewsNode, 'defaultCamera');
        this.cameras = [];
        this.defaultViewId = this.reader.getString(viewsNode, 'default');
        this.viewMap = new Map();
        for (let i = 0; i < viewsNode.children.length; i++) {
            let camera = viewsNode.children[i];
            var fromX, fromY, fromZ, toX, toY, toZ, near, far, id;
            near = this.reader.getFloat(camera, 'near');
            far = this.reader.getFloat(camera, 'far');

            let from = camera.children[0];
            fromX = this.reader.getFloat(from, 'x');
            fromY = this.reader.getFloat(from, 'y');
            fromZ = this.reader.getFloat(from, 'z');

            let to = camera.children[1];
            toX = this.reader.getFloat(to, 'x');
            toY = this.reader.getFloat(to, 'y');
            toZ = this.reader.getFloat(to, 'z');

            id = this.reader.getString(camera, 'id');
            if (viewsNode.children[i].nodeName == "perspective") {
                var angle;
                angle = this.reader.getFloat(camera, 'angle');


                this.cameras[i] = new CGFcamera(DEGREE_TO_RAD * angle, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ));
                this.viewMap.set(id, this.cameras[i]);
            }
            else if (viewsNode.children[i].nodeName == "ortho") {
                var left, right, top, bottom;

                let camera = viewsNode.children[i];
                left = this.reader.getFloat(camera, 'left');
                right = this.reader.getFloat(camera, 'right');
                top = this.reader.getFloat(camera, 'top');
                bottom = this.reader.getFloat(camera, 'bottom');

                this.cameras[i] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ), vec3.fromValues(0, 1, 0));
                this.viewMap.set(id, this.cameras[i]);
            }
        }

        this.log("Parsed cameras");

        return null;
    }
    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobals(ambientsNode) {

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

        this.lights = [];
        this.numLights = 0;

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
            if (this.lights[lightId] != null)
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

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            this.numLights++;
        }

        if (this.numLights == 0)
            return "at least one light must be defined";
        else if (this.numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        //this.onXMLMinorError("To do: Parse textures.");
        var children = texturesNode.children;

        if (children.length == 0) {
            return "at least one texture must be defined";
        }

        this.textures = [];
        var textId;
        var file;

        for (var i = 0; i < children.length; i++) {
            textId = this.reader.getString(children[i], 'id');
            if (textId == null || textId.length == 0) {
                return "A texture ID must be defined"
            }
            if (this.textures[textId] != null) {
                return textId + " already defined";
            }

            file = this.reader.getString(children[i], 'file');
            if (file == null || file.length == 0) {
                return "A file must be defined for texture " + textId;
            }

            if (file.includes('scenes/images')) {
                this.textures[textId] = new CGFtexture(this.scene, file);
            }
            else if (file.includes('images/')) {
                this.textures[textId] = new CGFtexture(this.scene, './scenes/' + file);
            }
            else {
                this.textures[textId] = new CGFtexture(this.scene, "./scenes/images/" + file);
            }

        }

        this.log("Parsed textures");

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

            //Continue here
            //this.onXMLMinorError("To do: Parse materials.");
            grandChildren = children[i].children;

            //Add tags to auxiliary variable
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //Verify if all tags exists
            if (nodeNames.indexOf("emission") == -1) {
                return "missing <emission> tag";
            }
            else if (nodeNames.indexOf("ambient") == -1) {
                return "missing <ambient> tag";
            }
            else if (nodeNames.indexOf("diffuse") == -1) {
                return "missing <diffuse> tag";
            }
            else if (nodeNames.indexOf("specular") == -1) {
                return "missing <specular> tag";
            }

            for (var j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName == "emission") {
                    var emission = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    }

                    var aux = this.parseColor(grandChildren[j], "emission");
                    if (aux == null) return "Missing emission of " + grandChildren[j].nodeName;
                }
                else if (grandChildren[j].nodeName == "ambient") {
                    var ambient = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    }

                    var aux = this.parseColor(grandChildren[j], "ambient");
                    if (aux == null) return "Missing ambient of " + grandChildren[j].nodeName;
                }
                else if (grandChildren[j].nodeName == "diffuse") {
                    var diffuse = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    }
                    var aux = this.parseColor(grandChildren[j], "diffuse");
                    if (aux == null) return "Missing diffuse of " + grandChildren[j].nodeName;
                }
                else if (grandChildren[j].nodeName == "specular") {
                    var specular = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    }

                    var aux = this.parseColor(grandChildren[j], "specular");
                    if (aux == null) return "Missing specular of " + grandChildren[j].nodeName;
                }
                else {
                    this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                    continue;
                }
            }
            this.materials[materialID] = new CGFappearance(this.scene);
            this.materials[materialID].setShininess(this.reader.getFloat(children[i], 'shininess'));
            this.materials[materialID].setEmission(emission.red, emission.green, emission.blue, emission.alpha);
            this.materials[materialID].setAmbient(ambient.red, ambient.green, ambient.blue, ambient.alpha);
            this.materials[materialID].setDiffuse(diffuse.red, diffuse.green, diffuse.blue, diffuse.alpha);
            this.materials[materialID].setSpecular(specular.red, specular.green, specular.blue, specular.alpha);
            this.currMatId.push(materialID);
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

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        //this.onXMLMinorError("To do: Parse scale transformations.");
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        // angle
                        //this.onXMLMinorError("To do: Parse rotate transformations.");
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        var angle = this.reader.getFloat(grandChildren[j], 'angle') * DEGREE_TO_RAD;
                        mat4.rotate(transfMatrix, transfMatrix, angle, this.axisCoords[axis]);
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
    * @param {animations block element} animationNode
    */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;
        this.animations = [];

        var animationId;
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            animationId = this.reader.getString(children[i], 'id') || null;
            if (animationId == null || animationId.length == 0) {
                return "no ID defined";
            }
            if (this.animations[animationId] != null) {
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";
            }

            this.animations[animationId] = children[i];

        }

        if (children.length != 0)
            this.log("Parsed Animations");
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
                grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'plane')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
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

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
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
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3) && x3 > x1))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3) && y3 > y1))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var trian = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

                this.primitives[primitiveId] = trian;
            }

            else if (primitiveType == 'cylinder' || primitiveType == 'cylinder2') {
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // baseRadius
                var baseRadius = this.reader.getFloat(grandChildren[0], 'base');
                if (!(baseRadius != null && !isNaN(baseRadius)))
                    return "unable to parse baseRadius of the primitive coordinates for ID = " + primitiveId;

                // topRadius
                var topRadius = this.reader.getFloat(grandChildren[0], 'top');
                if (!(topRadius != null && !isNaN(topRadius)))
                    return "unable to parse topRadius of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                let cylinder;
                if (primitiveType == 'cylinder')
                    cylinder = new MyCylinder(this.scene, primitiveId, slices, stacks, baseRadius, topRadius, height);
                else if (primitiveType == 'cylinder2')
                    cylinder = new Cylinder2(this.scene, primitiveId, baseRadius, topRadius, slices, stacks, height);

                this.primitives[primitiveId] = cylinder;
            }

            else if (primitiveType == 'sphere') {
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

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }

            else if (primitiveType == 'torus') {
                // innerRadius
                var innerRadius = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(innerRadius != null && !isNaN(innerRadius)))
                    return "unable to parse innerRadius of the primitive coordinates for ID = " + primitiveId;

                // outerRadius
                var outerRadius = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outerRadius != null && !isNaN(outerRadius)))
                    return "unable to parse outerRadius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, innerRadius, outerRadius, slices, loops);

                this.primitives[primitiveId] = torus;
            }

            else if (primitiveType == 'plane') {
                // uDiv
                var uDiv = this.reader.getFloat(grandChildren[0], 'uDiv');
                if (!(uDiv != null && !isNaN(uDiv)))
                    return "unable to parse uDiv of the primitive coordinates for ID = " + primitiveId;

                // vDiv
                var vDiv = this.reader.getFloat(grandChildren[0], 'vDiv');
                if (!(vDiv != null && !isNaN(vDiv)))
                    return "unable to parse vDiv of the primitive coordinates for ID = " + primitiveId;

                var plane = new MyPlane(this.scene, primitiveId, uDiv, vDiv);
                this.primitives[primitiveId] = plane;
            }

            else if (primitiveType == 'patch') {
                // uDiv
                var uDiv = this.reader.getFloat(grandChildren[0], 'uDiv');
                if (!(uDiv != null && !isNaN(uDiv)))
                    return "unable to parse uDiv of the primitive coordinates for ID = " + primitiveId;

                // vDiv
                var vDiv = this.reader.getFloat(grandChildren[0], 'vDiv');
                if (!(vDiv != null && !isNaN(vDiv)))
                    return "unable to parse vDiv of the primitive coordinates for ID = " + primitiveId;

                // uPart
                var uPart = this.reader.getFloat(grandChildren[0], 'uPart');
                if (!(uPart != null && !isNaN(uPart)))
                    return "unable to parse uPart of the primitive coordinates for ID = " + primitiveId;

                // vPart
                var vPart = this.reader.getFloat(grandChildren[0], 'vPart');
                if (!(vPart != null && !isNaN(vPart)))
                    return "unable to parse vPart of the primitive coordinates for ID = " + primitiveId;

                //control
                var control = grandChildren[0].getElementsByTagName('controlpoint');
                var controlPoint = [];

                for (var i = 0; i < control.length; ++i) {
                    var xx = this.reader.getFloat(control[i], 'xx');
                    var yy = this.reader.getFloat(control[i], 'yy');
                    var zz = this.reader.getFloat(control[i], 'zz');

                    controlPoint.push([xx, yy, zz, 1]);
                }

                var patch = new MyPatch(this.scene, primitiveId, uPart, vPart, uDiv, vDiv, controlPoint);
                this.primitives[primitiveId] = patch;
            }

            else {
                console.warn("To do: Parse other primitives.");
            }
            this.nodes[primitiveId] = new Node(primitiveId, 'primitive');
            this.nodes[primitiveId].primitive = this.primitives[primitiveId];
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
      * Build the components graph
      * @param {String} node id
      * @param {Node element} parent node
      * @param {List} List with components
      */
    graphBuilder(id, parent, nodeList) {
        var node = new Node(id, 'component');
        var children = nodeList[id].children;
        var grandChildren;
        node.parent = parent;

        if (children.length == 0) {
            this.onXMLMinorError("graphBuilder: at least one component must be defined");
            return null;
        }

        for (var j = 0; j < children.length; j++) {
            switch (children[j].nodeName) {
                case "transformation":
                    grandChildren = children[j].children;
                    for (var k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName == "transformationref") {
                            var transfId = this.reader.getString(grandChildren[k], 'id');
                            if (transfId.length == 0) {
                                this.onXMLMinorError("graphBuilder: an transformation id must be defined in order to reference it");
                                continue;
                            }
                            if (this.transformations[transfId] == null) {
                                this.onXMLMinorError("graphBuilder: transformation '" + transfId + "' does not exist");
                                continue;
                            }
                            mat4.multiply(node.transformMatrix, node.transformMatrix, this.transformations[transfId]);
                        }
                        else if (grandChildren[k].nodeName == "translate") {
                            var x = this.reader.getFloat(grandChildren[k], 'x');
                            var y = this.reader.getFloat(grandChildren[k], 'y');
                            var z = this.reader.getFloat(grandChildren[k], 'z');
                            mat4.translate(node.transformMatrix, node.transformMatrix, [x, y, z]);
                        }
                        else if (grandChildren[k].nodeName == "rotate") {
                            var axis = this.reader.getString(grandChildren[k], 'axis');
                            var angle = this.reader.getFloat(grandChildren[k], 'angle') * DEGREE_TO_RAD;
                            mat4.rotate(node.transformMatrix, node.transformMatrix, angle, this.axisCoords[axis]);
                        }
                        else if (grandChildren[k].nodeName == "scale") {
                            var x = this.reader.getFloat(grandChildren[k], 'x');
                            var y = this.reader.getFloat(grandChildren[k], 'y');
                            var z = this.reader.getFloat(grandChildren[k], 'z');
                            mat4.scale(node.transformMatrix, node.transformMatrix, [x, y, z]);
                        }
                        else {
                            this.onXMLMinorError("unknown tag <" + grandChildren[k].nodeName + ">");
                            continue;
                        }
                    }
                    break;
                case "materials":
                    grandChildren = children[j].children;
                    if (grandChildren.length == 0) {
                        this.onXMLMinorError("graphBuilder: at least one material must be assigned to component '" + node.id + "'");
                        return null;
                    }
                    for (var k = 0; k < grandChildren.length; k++) {
                        var materialId = this.reader.getString(grandChildren[k], 'id');
                        if (materialId.length == 0) {
                            this.onXMLMinorError("graphBuilder: an existing material id must be defined in order to be referenced");
                            continue;
                        }
                        if (materialId != "inherit" && this.materials[materialId] == null) {
                            this.onXMLMinorError("graphBuilder: material '" + materialId + "' does not exist");
                            continue;
                        }
                        if (materialId == "inherit") {
                            if (node.id == this.idRoot) {
                                var appearance = new CGFappearance(this.scene);
                                appearance.setShininess(10);
                                appearance.setEmission(0, 0, 0, 0);
                                appearance.setAmbient(0.5, 0.5, 0.5, 1.0);
                                appearance.setDiffuse(0.5, 0.5, 0.5, 1.0);
                                appearance.setSpecular(0.5, 0.5, 0.5, 1.0);

                                node.materials.push(appearance);
                            }
                            else {
                                for (var i = 0; i < node.parent.materials.length; i++) {
                                    node.materials.push(node.parent.materials[i]);
                                }
                            }
                        }
                        else {
                            node.materials.push(this.materials[materialId]);
                        }
                    }

                    this.currMatId[node.id] = {
                        current: 0,
                        total: node.materials.length
                    };
                    break;
                case "texture":
                    var textId = this.reader.getString(children[j], 'id');
                    if (textId == 'none') {
                        node.texture = {
                            texture: textId
                        }
                    }
                    else if (textId == 'inherit') {
                        var length_s = this.reader.getFloat(children[j], 'length_s', false);
                        var length_t = this.reader.getFloat(children[j], 'length_t', false)

                        if (length_s != null && length_t != null) {
                            node.texture = {
                                texture: node.parent.texture.texture,
                                length_s: length_s,
                                length_t: length_t
                            }
                        }
                        else {
                            node.texture = {
                                texture: node.parent.texture.texture,
                                length_s: node.parent.texture.length_s,
                                length_t: node.parent.texture.length_t
                            }
                        }
                    }
                    else {
                        node.texture = {
                            texture: this.textures[textId],
                            length_s: this.reader.getFloat(children[j], 'length_s'),
                            length_t: this.reader.getFloat(children[j], 'length_t')
                        }
                    }
                    break;
                case "children":
                    grandChildren = children[j].children;
                    if (grandChildren.length == 0) {
                        this.onXMLMinorError("graphBuilder: at least one reference to a primitive or a component must be assigned to component '" + node.id + "'");
                        return null;
                    }

                    for (var k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName == "componentref") {
                            var refId = this.reader.getString(grandChildren[k], 'id');
                            if (nodeList[refId] == null) {
                                this.onXMLMinorError("graphBuilder: component '" + refId + "' not defined");
                                continue;
                            }
                            var child = this.graphBuilder(refId, node, nodeList);
                            node.children.push(child);
                        }
                        else if (grandChildren[k].nodeName == "primitiveref") {
                            var refId = this.reader.getString(grandChildren[k], 'id');
                            if (this.primitives[refId] == null) {
                                this.onXMLMinorError("graphBuilder: primitive " + refId + " not defined.");
                                continue;
                            }
                            else {
                                this.nodes[refId].parents.push(node);
                                node.children.push(this.nodes[refId]);
                            }
                        }
                        else {
                            this.onXMLMinorError("graphBuilder: unknown tag <" + grandChildren[k].nodeName + "> in children of " + node.id);
                            continue;
                        }
                    }
                    break;
                case "animations":
                    grandChildren = children[j].children;
                    var animations = [];

                    for (let k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName != "keyframe")
                            return "There must be, at least, one keyframe per animation";
                        else if (grandChildren[k].children.length != 3)
                            return "Missing transformations";
                        else if (grandChildren[k].children[0].nodeName != "translate" ||
                            grandChildren[k].children[1].nodeName != "rotate" ||
                            grandChildren[k].children[2].nodeName != "scale")
                            return "Transformations missing/not in order";

                        var instant = this.reader.getString(grandChildren[k], 'instant');

                        var translate = [
                            this.reader.getString(grandChildren[k].children[0], 'x'),
                            this.reader.getString(grandChildren[k].children[0], 'y'),
                            this.reader.getString(grandChildren[k].children[0], 'z')
                        ]
                        var rotate = [
                            this.reader.getString(grandChildren[k].children[1], 'angle_x'),
                            this.reader.getString(grandChildren[k].children[1], 'angle_y'),
                            this.reader.getString(grandChildren[k].children[1], 'angle_z')
                        ]
                        var scale = [
                            this.reader.getString(grandChildren[k].children[2], 'x'),
                            this.reader.getString(grandChildren[k].children[2], 'y'),
                            this.reader.getString(grandChildren[k].children[2], 'z')
                        ]

                        var animation = {
                            instant: instant,
                            translate: translate,
                            rotate: rotate,
                            scale: scale,
                        }

                        animations.push(animation);
                    }
                    var keyframe = new KeyframeAnimation(this.scene, animations);
                    node.animation = keyframe;
                    break;
                default:
                    this.onXMLMinorError("graphBuilder: unknow tag <" + children[j].nodeName + "> for component " + node.id);
                    continue;
            }
        }
        this.nodes[node.id] = node;
        return node;

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

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";


            this.components[componentID] = children[i];
        }
        this.nodeAux = this.graphBuilder(this.idRoot, null, this.components);

        if (this.nodeAux == null) {
            return "Error parsing components"
        }
        else {
            this.log("Parsed components");
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
    * Run the graph and display the elements, applying textures, materials.
    *
    * @param CGFScene scene
    * @param Node node
    */
    renderScene(scene, node) {
        scene.multMatrix(node.transformMatrix);
        this.nodeMaterial = node.materials;

        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].type == 'primitive') {
                this.materials[this.currMatId[this.currMat]].apply();
                if (node.texture.texture != "none") {
                    node.children[i].primitive.updateTexCoords(node.texture.length_s, node.texture.length_t);
                    node.texture.texture.bind();
                }
                node.children[i].primitive.display();
            }
        }
        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].type == 'component') {
                scene.pushMatrix();
                this.renderScene(scene, node.children[i]);
                scene.popMatrix();
            }
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
       /* for (const primitive in this.primitives) {
            this.scene.scale(20,20,20);
            this.primitives[primitive].display();
        }
        */

        //To test the parsing/creation of the primitives, call the display function directly
        //this.primitives['demoRectangle'].display();
        
        this.scene.pushMatrix();
        this.renderScene(this.scene, this.nodeAux);
        this.scene.popMatrix();
        
    }

}



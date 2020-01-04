/**
 * GraphNode, class represents intermediate node.
 * @constructor
 **/

class GraphNode {
    constructor(graph, nodeID) {
        this.graph = graph;

        this.nodeID = nodeID;

        // IDs of child nodes.
        this.children = [];


        // The materials
        this.materials = [];

        // The texture ID.
        this.textureID = [];

        this.transformMatrix = mat4.create();
        mat4.identity(this.transformMatrix);

        this.animationID = [];
    }

    /**
     * Adds the reference (ID) of another node to this node's children array.
     */
    addChild = function(nodeID) {
        this.children.push(nodeID);
    }
}
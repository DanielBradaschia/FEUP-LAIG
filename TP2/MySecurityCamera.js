class MySecurityCamera extends CGFobject {

    constructor(scene) {
        super(scene);

        this.rectangle = new MyRectangle(scene, 1, 10, 10, 10, 10);

        this.rectangle_shader = [new CGFshader(this.gl, "shaders/texture2.vert", "shaders/texture2.frag")];

        this.initBuffers();
    };

    display() {
        this.setActiveShader(this.rectangle_shader[0]);

        XMLscene.texture_rtt.bind();
    }
}
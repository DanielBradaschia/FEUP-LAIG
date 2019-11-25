class MySecurityCamera extends CGFobject {

    constructor(scene) {
        super(scene);

        //this.scene.gl.canvas.width = 982
        //this.scene.gl.canvas.height = 722
        this.rectangle = new MyRectangle(scene, 1, 0.3, 1, -0.25, -1);

        this.rectangle_shader = new CGFshader(this.scene.gl, "shaders/texture2.vert", "shaders/texture2.frag");
        this.init();
        this.initBuffers();
    };

    init(){
        this.rectangle_shader.setUniformsValues({ uSampler: 1 });
    }

    display() {
        this.scene.setActiveShader(this.rectangle_shader);
        this.scene.texture_rtt.bind();
        this.rectangle.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
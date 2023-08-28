import Experience from "./Experience.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    const { canvas, sizes, scene, camera } = this.experience;
    this.canvas = canvas;
    this.sizes = sizes;
    this.scene = scene;
    this.camera = camera;

    this.setInstance();
  }

  setInstance() {
    const loadThree = () => import("three");

    // When you need to use the component, call the function
    loadThree().then((module) => {
      this.instance = new module.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
      });
      this.instance.useLegacyLights = true;
      this.instance.toneMapping = module.CineonToneMapping;
      this.instance.toneMappingExposure = 1.75;
      this.instance.shadowMap.enabled = true;
      this.instance.shadowMap.type = module.PCFSoftShadowMap;
      this.instance.setClearColor("#f47de9");
      this.instance.setSize(this.sizes.width, this.sizes.height);
      this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
      // this.initStatsUI();
    });
  }

  initStatsUI() {
    this.glS = new glStats(); // init at any point
    this.tS = new threeStats(this.instance); // init after WebGLRenderer is created
    this.rS = new rStats({
      values: {
        frame: { caption: "Total frame time (ms)", over: 16 },
        fps: { caption: "Framerate (FPS)", below: 30 },
        calls: { caption: "Calls (three.js)", over: 3000 },
        raf: { caption: "Time since last rAF (ms)" },
        rstats: { caption: "rStats update (ms)" },
      },
      groups: [
        { caption: "Framerate", values: ["fps", "raf"] },
        {
          caption: "Frame Budget",
          values: ["frame", "texture", "setup", "render"],
        },
      ],
      fractions: [{ base: "frame", steps: ["action1", "render"] }],
      plugins: [this.tS, this.glS],
    });
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    if (this.instance) {
      // this.rS("frame").start();
      // this.glS.start();
      // this.rS("frame").start();
      // this.rS("rAF").tick();
      // this.rS("FPS").frame();
      // this.rS("action1").start();
      // /* Perform action #1 */
      // this.rS("action1").end();
      // this.rS("render").start();
      this.instance.render(this.scene, this.camera.instance);
      // this.rS("render").end();
      // this.rS("frame").end();
      // this.rS().update();
    }
  }
}

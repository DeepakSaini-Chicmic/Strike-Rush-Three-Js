import CannonDebugger from "cannon-es-debugger";
import Debug from "./Utils/Debug.js";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import SceneWorld from "./World/SceneWorld.js";
import Resources from "./Utils/Resources.js";
import { SOURCES } from "./Utils/Constants.js";
import AudioManager from "./World/AudioManager.js";

import { Mesh, Scene } from "three";
import { World, Vec3 } from "cannon-es";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = _canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new Scene();
    this.camera = new Camera();
    this.resources = new Resources(SOURCES);
    this.audioManager = new AudioManager();
    this.renderer = new Renderer();
    this.physicsWorld = new World({ gravity: new Vec3(0, -9.8, 0) });
    this.world = new SceneWorld();
    this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld);
    this.isMobile = this.detectDevice();
    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  detectDevice() {
    let isMobile = window.matchMedia;
    if (isMobile) {
      let match_mobile = isMobile("(pointer:coarse)");
      return match_mobile.matches;
    }
    return false;
  }

  update() {
    const deltaTime = this.time.delta;
    this.camera.update();
    // console.log();
    // const deltavalue =
    //   (1000 / deltaTime).toFixed(0) > 60 ? 60 : (1000 / deltaTime).toFixed(0);
    // this.physicsWorld.step(1 / 60, deltaTime, 3);
    if (this.isMobile) this.physicsWorld.step(1 / 30, deltaTime, 3);
    else this.physicsWorld.step(1 / 60, deltaTime, 3);
    this.world.update();
    // this.cannonDebugger.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}

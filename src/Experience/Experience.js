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

    this.t = 0.0;
    console.log(this.physicsWorld.default_dt);
    this.dt = this.physicsWorld.default_dt;
    this.currentTime = performance.now(); // or your preferred high-res timer
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
    // let newTime = performance.now();
    // let frameTime = (newTime - this.currentTime) / 1000; // Convert to seconds
    // this.currentTime = newTime;
    // console.log(frameTime);
    // while (frameTime > 0) {
    //   const deltaTime = Math.min(frameTime, this.dt);
    const deltaTime = this.time.delta;
    this.physicsWorld.step(1 / 60, deltaTime, 3);
    //   frameTime -= deltaTime;
    //   this.t += deltaTime;
    // }
    this.world.update();
    this.camera.update();
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

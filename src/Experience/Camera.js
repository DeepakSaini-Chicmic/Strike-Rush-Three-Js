import { gsap } from "gsap";
import Experience from "./Experience.js";

import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    const { sizes, scene, canvas } = this.experience;
    this.sizes = sizes;
    this.scene = scene;
    this.canvas = canvas;

    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      60,
      this.sizes.width / this.sizes.height,
      0.1,
      10000
    );
    this.instance.position.set(10, 30, 30);
    this.instance.lookAt(0, 0, 0);
    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    // this.controls.target = new Vector3(0, 10, -676);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    // this.controls.update();
  }
}

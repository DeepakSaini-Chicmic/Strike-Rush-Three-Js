import Experience from "../Experience";

import { Vector2 } from "three";

export default class Movement {
  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera.instance;
    this.camera.lookAt(0, 0, 0);
    this.mouse = new Vector2(0, 0);
    this.startGame = false;
    this.time = this.experience.time;
    this.player = this.experience.world.player;
    this.registerEvents();
  }

  registerEvents() {
    window.addEventListener("touchmove", (e) => this.mousemove(e));
    window.addEventListener("mousemove", (e) => this.mousemove(e));
    window.addEventListener("click", () => {
      if (!this.startGame) {
        this.startGame = true;
        this.player.giveVelocity();
      }
    });
  }

  mousemove(event) {
    if (this.startGame === true) {
      this.mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.y = -(event.clientY / window.innerHeight - 0.5) * 2;
      this.player.moveDirection(this.mouse);
    }
  }

  movePlayer() {
    this.player.position.x = this.mouse.x * 4;
  }

  update() {
    const deltaTime = this.time.delta;
    if (this.startGame === true) {
      this.player.update();
    }
  }
}

import Experience from "../../Experience.js";
import { getPhysicsBody } from "../../Utils/PhycisBodyHelper.js";
import { ShapeType } from "three-to-cannon";

import { Vector3, AnimationMixer } from "three";

export default class AnimatedObstacle {
  constructor(obstacleType, modelPosition, modelScaling, obstacleMaterial) {
    this.experience = new Experience();
    const { scene, resources, time, debug, physicsWorld } = this.experience;

    this.scene = scene;
    this.resources = resources;
    this.time = time;
    this.debug = debug;
    this.physicsWorld = physicsWorld;
    this.obstacleMaterial = obstacleMaterial;

    // Resources
    this.resource = obstacleType.scene.clone();
    console.log(this.resource);
    this.rigidBodiesArray = [];
    this.meshesArray = [];
    this.setModel(modelPosition, modelScaling);
  }

  setModel(modelPosition, modelScaling) {
    this.model = this.resource;
    this.model.scale.set(100, 100, 100);
    this.model.position.copy(modelPosition);
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        this.meshesArray.push(child);
        const rigidBody = getPhysicsBody(
          child,
          ShapeType.MESH,
          this.obstacleMaterial,
          0
        );
        rigidBody.quaternion.copy(child.quaternion);
        this.rigidBodiesArray.push(rigidBody);
        this.physicsWorld.addBody(rigidBody);
      }
    });
    this.scene.add(this.model);
    // this.playAnimation();
  }

  playAnimation() {
    this.animation = this.model.scene.animations[0];
    this.mixer = new AnimationMixer(this.model);
    const action = this.mixer.clipAction(this.animation);
    action.timeScale = 0.95;
    action.play();
  }

  update() {
    // this.mixer.update(this.time.delta * 0.001); //Anish-> Previous
    // this.mixer.update(this.time.delta); //Anish-> Changed
    const deltaTimeSeconds = this.time.delta * 0.001;
    // this.mixer.update(deltaTimeSeconds);
    for (const [i, physicsBody] of this.rigidBodiesArray.entries()) {
      const mesh = this.meshesArray[i];
      physicsBody.position.copy(mesh.getWorldPosition(new Vector3()));
      physicsBody.quaternion.copy(mesh.quaternion);
    }
  }
}

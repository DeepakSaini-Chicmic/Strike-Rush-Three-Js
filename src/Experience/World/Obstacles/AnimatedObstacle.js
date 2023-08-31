import Experience from "../../Experience.js";
import { getPhysicsBody } from "../../Utils/PhycisBodyHelper.js";
import { ShapeType } from "three-to-cannon";

import {
  Vector3,
  AnimationMixer,
  BufferGeometry,
  MeshBasicMaterial,
  Line,
  Mesh,
} from "three";

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
    this.resource = obstacleType.clone();
    this.pointsArray = [];
    let i = 0;
    this.resource.traverse((child) => {
      if (child.isMesh) {
        console.log(child.geometry);
        this.pointsArray[i++] = child.geometry;
      }
    });
    const obs = this.pointsArray[--i];

    const material = new MeshBasicMaterial({ color: 0xffffff });

    const lineMesh = new Mesh(obs, material);
    


    this.scene.add(lineMesh);
    this.rigidBodiesArray = [];
    this.meshesArray = [];
    this.setModel(modelPosition, modelScaling);
  }

  setModel(modelPosition, modelScaling) {
    this.model = this.resource;
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
    this.playAnimation();
  }

  playAnimation() {
    this.animation = this.model.animations[0];
    this.mixer = new AnimationMixer(this.model);
    const action = this.mixer.clipAction(this.animation);
    action.timeScale = 0.95;
    action.play();
  }

  update() {
    // this.mixer.update(this.time.delta * 0.001); //Anish-> Previous
    // this.mixer.update(this.time.delta); //Anish-> Changed
    const deltaTimeSeconds = this.time.delta * 0.001;
    this.mixer.update(deltaTimeSeconds);
    for (const [i, physicsBody] of this.rigidBodiesArray.entries()) {
      const mesh = this.meshesArray[i];
      physicsBody.position.copy(mesh.getWorldPosition(new Vector3()));
      physicsBody.quaternion.copy(mesh.quaternion);
    }
  }
}
